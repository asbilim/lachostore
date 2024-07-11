/* eslint-disable react/display-name */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Zap, X, Send, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

const INITIAL_MESSAGES = [
  {
    id: 1,
    user: "AI",
    content: "Welcome to the next-gen chat interface!",
    timestamp: "2024-07-10T10:00:00Z",
    sentiment: "neutral",
  },
  {
    id: 2,
    user: "You",
    content: "This looks incredible!",
    timestamp: "2024-07-10T10:01:00Z",
    sentiment: "positive",
  },
  {
    id: 3,
    user: "AI",
    content: "Thank you! I'm here to assist you with any questions.",
    timestamp: "2024-07-10T10:02:00Z",
    sentiment: "positive",
  },
];

const useStreamingText = (text, speed = 20) => {
  const [streamedText, setStreamedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    setIsComplete(false);
    const intervalId = setInterval(() => {
      setStreamedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return [streamedText, isComplete];
};

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState("light");
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

  const sendMessage = useCallback(() => {
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
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        user: "AI",
        content: "I understand your sentiment. How can I assist you further?",
        timestamp: new Date().toISOString(),
        sentiment: "neutral",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  }, [inputMessage, messages.length, controls]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      toast({
        title: "Chat Activated",
        description: "Welcome to the next-gen chat experience!",
        duration: 3000,
      });
    }
  };

  const toggleTheme = () => {
    console.log();
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
            <h2 className="text-xl font-bold">Nexus Chat</h2>
            <div className="flex space-x-2">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                className="hover:bg-primary-foreground hover:text-primary rounded-full h-8 w-8 p-0">
                <Sparkles className="h-5 w-5" />
              </Button>
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
                AI is crafting a response...
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
                placeholder="Type your message..."
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

const MessageBubble = React.memo(({ message }) => {
  const [streamedContent, isComplete] = useStreamingText(message.content);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ scale: [0.9, 1.1, 1], transition: { duration: 0.5 } });
  }, [controls]);

  useEffect(() => {
    if (message.user === "AI") {
      gsap.fromTo(
        ".ai-bubble",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    } else {
      gsap.fromTo(
        ".user-bubble",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [message.user]);

  return (
    <motion.div
      className={`mb-4 max-w-[80%] ${
        message.user === "You" ? "ml-auto user-bubble" : "mr-auto ai-bubble"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}>
      <motion.div animate={controls} className="flex items-start gap-2">
        <Avatar
          className={cn("w-8 h-8", message.user === "You" ? "order-2" : "")}>
          <AvatarFallback className="flex items-center justify-center">
            {message.user[0]}
          </AvatarFallback>
        </Avatar>
        <motion.div
          className={cn(
            "p-3 rounded-2xl",
            message.user === "You"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
            message.sentiment === "positive" &&
              "bg-success text-success-foreground",
            message.sentiment === "negative" &&
              "bg-destructive text-destructive-foreground"
          )}
          whileHover={{ scale: 1.05 }}>
          {streamedContent}
          {!isComplete && <span className="animate-pulse">|</span>}
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

export default FloatingChat;
