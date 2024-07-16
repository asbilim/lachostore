"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Zap, X, Send, Sparkles, MessageSquare, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Lachofit information array
const LACHOFIT_INFO = [
  {
    type: "shop",
    name: "Lachofit",
    description:
      "Premium fitness apparel, equipment shop, and comprehensive fitness services including nutrition advice and personalized plans.",
  },
  {
    type: "faq",
    question: "What is Lachofit's return policy?",
    answer:
      "Lachofit offers a 30-day return policy for unused items in original packaging.",
  },
  {
    type: "faq",
    question: "Do you offer international shipping?",
    answer:
      "Yes, Lachofit ships to most countries worldwide. Shipping costs vary by location.",
  },
  {
    type: "faq",
    question: "What services does Lachofit offer?",
    answer:
      "Lachofit provides a comprehensive suite of fitness services including nutrition advice, personalized weight loss or gain plans, one-to-one coaching consultations, and more.",
  },
  {
    type: "faq",
    question: "How do I start my fitness journey with Lachofit?",
    answer:
      "Start by signing up on our website. Once registered, our expert team will guide you through an initial assessment and set you on the path to achieving your fitness goals.",
  },
  {
    type: "faq",
    question: "Are the nutrition plans tailored for Cameroonians?",
    answer:
      "Yes! Our nutrition plans are specifically designed with Cameroonian dietary habits and locally available ingredients in mind.",
  },
  {
    type: "faq",
    question: "What is the cost of the one-to-one coaching consultation?",
    answer:
      "The pricing for our one-to-one coaching consultation varies based on the duration and specific needs of the individual. Please get in touch with our team for detailed pricing.",
  },
  {
    type: "product",
    name: "Lachofit Sports Shoes",
    price: "XAF 14,999",
    description:
      "Your ultimate workout companion, designed for versatility and performance with features like flexibility, cushioning, and durability.",
  },
  {
    type: "product",
    name: "Glucose Smartwatch (E500)",
    price: "XAF 25,000",
    description:
      "Track your fitness and health metrics with advanced glucose monitoring features.",
  },
  {
    type: "product",
    name: "Sport Smartwatch (NX10)",
    price: "XAF 16,999",
    description:
      "A versatile smartwatch with an AMOLED display designed for fitness enthusiasts.",
  },
  {
    type: "blog",
    title: "7 Tips to Achieve Mental Wellbeing When Life Gets Busy",
    date: "November 18, 2023",
    url: "https://blog.lachofit.com/7-tips-to-achieve-mental-wellbeing",
  },
  {
    type: "blog",
    title: "How Do I Lose Weight Healthily? 6 Practical Tips",
    date: "October 12, 2023",
    url: "https://blog.lachofit.com/how-do-i-lose-weight-healthily",
  },
  {
    type: "blog",
    title:
      "Mastering Macronutrients: Key to Unlocking Your Fitness Goals and Optimum Health",
    date: "October 12, 2023",
    url: "https://blog.lachofit.com/mastering-macronutrients",
  },
  {
    type: "social",
    platform: "Facebook",
    url: "https://facebook.com/lachofit",
  },
  {
    type: "social",
    platform: "Twitter",
    url: "https://twitter.com/lachofit",
  },
  {
    type: "social",
    platform: "Instagram",
    url: "https://instagram.com/lachofit",
  },
];

// Combine products with Lachofit information
const combineInfoWithProducts = (products) => {
  return products.map((product) => ({
    type: "product",
    ...product,
  }));
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
  const { theme, setTheme } = useTheme();

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={toggleChat}
                variant="ghost"
                className="hover:bg-primary-foreground hover:text-primary rounded-full h-8 w-8 p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>
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
          <div className="mt-1 text-xs opacity-70">
            {new Date().toLocaleTimeString()}
          </div>
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
