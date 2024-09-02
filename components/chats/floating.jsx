"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Send, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Badge } from "@/components/ui/badge";

// Constants
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, {
  model: GEMINI_MODEL,
});

// Lachofit information array
const LACHOFIT_INFO = [
  {
    type: "shop",
    name: "Lachofit",
    description:
      "Premium fitness apparel, equipment shop, and comprehensive fitness services including nutrition advice and personalized plans.",
  },
  // ... Other information
];

// Combine products with Lachofit information
const combineInfoWithProducts = (products) => {
  return (
    products?.map((product) => ({
      type: "product",
      ...product,
    })) || []
  );
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    user: "AI",
    content:
      "Welcome to Lachofit! How can I assist you with our products today?",
    timestamp: new Date().toISOString(),
    sentiment: "neutral",
  },
];

const FloatingChat = ({ products }) => {
  const combinedInfo = [...LACHOFIT_INFO, ...combineInfoWithProducts(products)];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  const controls = useAnimation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const analyzeSentiment = (text) => {
    const positiveWords = [
      "great",
      "awesome",
      "excellent",
      "good",
      "nice",
      "love",
      "like",
    ];
    const negativeWords = [
      "bad",
      "awful",
      "terrible",
      "hate",
      "dislike",
      "poor",
    ];

    const words = text.toLowerCase().split(" ");
    const positiveCount = words.filter((word) =>
      positiveWords.includes(word)
    ).length;
    const negativeCount = words.filter((word) =>
      negativeWords.includes(word)
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const generateAIResponse = async (userMessage) => {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `
      You are a helpful assistant for the Lachofit shop. Use the following information to answer questions:
      ${JSON.stringify(combinedInfo)}

      User question: ${userMessage}

      Provide a concise and helpful response based on the given information.
    `;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm sorry, I encountered an error while processing your request.";
    }
  };

  const simulateTyping = async (text, setMessage) => {
    const words = text.split(" ");
    let currentText = "";
    for (const word of words) {
      currentText += word + " ";
      setMessage(currentText);
      await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust delay as needed
    }
  };

  const sendMessage = useCallback(async () => {
    if (inputMessage.trim() === "") return;
    const sentiment = analyzeSentiment(inputMessage);
    const newMessage = {
      id: messages.length + 1,
      user: "You",
      content: inputMessage,
      timestamp: new Date().toISOString(),
      sentiment,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    });

    const aiResponse = await generateAIResponse(inputMessage);

    const aiMessageId = messages.length + 2;
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        user: "AI",
        content: "",
        timestamp: new Date().toISOString(),
        sentiment: "neutral",
      },
    ]);

    await simulateTyping(aiResponse, (text) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: text } : msg
        )
      );
    });

    setIsTyping(false);
  }, [inputMessage, messages.length, controls]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      toast({
        title: "Lachofit Chat Activated",
        description: "Welcome to your personal fitness assistant!",
        duration: 3000,
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}>
        <motion.div
          animate={controls}
          className={cn(
            "w-full md:w-96 h-[32rem] flex flex-col rounded-2xl overflow-hidden shadow-2xl",
            isOpen ? "bg-background" : "bg-transparent"
          )}
          style={{ display: isOpen ? "flex" : "none" }}>
          <motion.div
            className="flex justify-between items-center p-4 bg-primary text-primary-foreground"
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}>
            <h2 className="text-xl font-bold">Lachofit Assistant</h2>
            <Button
              onClick={toggleChat}
              variant="ghost"
              className="hover:bg-primary-foreground hover:text-primary rounded-full h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
          <ScrollArea className="flex-grow p-4">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex items-center text-muted-foreground ml-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Lachofit Assistant is responding...
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <motion.div
            className="p-4 bg-muted"
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow bg-background text-foreground border-none focus:ring-2 focus:ring-primary"
                placeholder="Ask about Lachofit products..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                className="bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
        <motion.button
          className={cn(
            "rounded-full p-4 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300",
            isOpen
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          )}
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

// eslint-disable-next-line react/display-name
const MessageBubble = React.memo(({ message }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ scale: [0.9, 1.1, 1], transition: { duration: 0.5 } });
  }, [controls]);

  return (
    <motion.div
      className={`mb-4 max-w-[80%] ${
        message.user === "You" ? "ml-auto" : "mr-auto"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}>
      <motion.div animate={controls} className="flex items-start gap-2">
        <Avatar
          className={cn("w-8 h-8", message.user === "You" ? "order-2" : "")}>
          <AvatarFallback>{message.user[0]}</AvatarFallback>
          {message.user === "AI" && (
            <AvatarImage src="/lachofit-logo.png" alt="Lachofit Logo" />
          )}
        </Avatar>
        <motion.div
          className={cn(
            "p-3 rounded-2xl",
            message.user === "You"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
          whileHover={{ scale: 1.05 }}>
          {message.content}
          <div className="mt-1 text-xs opacity-70"></div>
        </motion.div>
      </motion.div>
      {message.sentiment !== "neutral" && (
        <Badge
          variant={message.sentiment === "positive" ? "success" : "destructive"}
          className="mt-1 ml-10">
          {message.sentiment}
        </Badge>
      )}
    </motion.div>
  );
});

export default FloatingChat;
