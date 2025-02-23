"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useLogin } from "./hooks/useLogin";
import { sign } from "crypto";

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login, signUp } = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      await login();
    } else {
      await signUp();
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLoginMode
              ? "Enter your username to continue"
              : "Choose a username to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg relative">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                text-foreground placeholder:text-muted-foreground"
              placeholder={
                isLoginMode ? "Enter your username" : "Choose a username"
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg 
              hover:bg-primary/90 transition duration-200 font-semibold
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {isLoginMode ? "Continue" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-primary hover:text-primary/90 hover:underline text-sm
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg px-2 py-1"
          >
            {isLoginMode
              ? "New to ChatApp? Create an account"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
