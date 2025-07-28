"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Avatar, CircularProgress } from '@mui/material';
import { Send, Chat, Close, SmartToy, Refresh } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const OpenRouterChatbot = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của Electro. Tôi có thể tư vấn về sản phẩm điện tử, hướng dẫn mua hàng và hỗ trợ bạn. Bạn cần gì ạ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (pathname.includes('/seller') || !isSignedIn) {
    return null;
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Tạo conversation history từ các tin nhắn trước đó
    const conversationHistory = messages
      .filter(msg => msg.sender !== 'bot' || msg.id !== 1) // Loại bỏ tin nhắn chào mừng đầu tiên
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/openrouter/chat`, {
        message: inputMessage,
        conversationHistory: conversationHistory
      });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Use fallback response if available
        const fallbackText = response.data.fallback || "Xin lỗi, tôi đang gặp sự cố. Bạn có thể thử lại sau không?";
        const botMessage = {
          id: Date.now() + 1,
          text: fallbackText,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, tôi đang gặp sự cố kết nối. Bạn có thể thử lại sau không?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const resetConversation = () => {
    setMessages([
      {
        id: 1,
        text: "Xin chào! Tôi là trợ lý AI của Electro. Tôi có thể tư vấn về sản phẩm điện tử, hướng dẫn mua hàng và hỗ trợ bạn. Bạn cần gì ạ?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            bgcolor: '#ea580c',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              bgcolor: '#c2410c'
            },
            boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {isOpen ? <Close sx={{ fontSize: 20 }} /> : <Chat sx={{ fontSize: 20 }} />}
        </IconButton>
      </Box>

      {/* Chat Window */}
      {isOpen && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 320,
            height: 480,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
            borderRadius: 3,
            border: '1px solid #fed7aa'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              p: 2.5,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <SmartToy sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Trợ lý AI Electro
            </Typography>
            <IconButton
              onClick={resetConversation}
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              title="Bắt đầu cuộc hội thoại mới"
            >
              <Refresh />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: '#fef7ed',
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#fef7ed'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#fed7aa',
                borderRadius: '3px'
              }
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 0.5
                    }}
                  >
                    {message.sender === 'bot' && (
                      <Avatar sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: '#ea580c',
                        border: '1px solid #fed7aa'
                      }}>
                        <SmartToy sx={{ fontSize: 14 }} />
                      </Avatar>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {formatTime(message.timestamp)}
                    </Typography>
                    {message.sender === 'user' && (
                      <Avatar sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: '#16a34a',
                        border: '1px solid #bbf7d0'
                      }}>
                        U
                      </Avatar>
                    )}
                  </Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' 
                        : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 3,
                      boxShadow: message.sender === 'user' 
                        ? '0 4px 12px rgba(234, 88, 12, 0.2)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: message.sender === 'user' 
                        ? 'none' 
                        : '1px solid #fed7aa'
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                      {message.text}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: '#ea580c',
                    border: '1px solid #fed7aa'
                  }}>
                    <SmartToy sx={{ fontSize: 14 }} />
                  </Avatar>
                  <CircularProgress size={20} sx={{ color: '#ea580c' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    Đang nhập...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'white',
            borderTop: '1px solid #fed7aa',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: '#fed7aa'
                    },
                    '&:hover fieldset': {
                      borderColor: '#ea580c'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ea580c'
                    }
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 12px'
                  }
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{
                  bgcolor: '#ea580c',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#c2410c'
                  },
                  '&:disabled': {
                    bgcolor: '#e5e7eb',
                    color: '#9ca3af'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)'
                }}
              >
                <Send sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default OpenRouterChatbot;
 