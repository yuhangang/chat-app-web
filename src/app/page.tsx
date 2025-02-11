import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Star, Users, Zap, Shield } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-gray-700">New Features Available</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            Build faster with our
            <span className="text-blue-600"> modern platform</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your workflow with our cutting-edge tools and solutions.
            Start building today.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/chats" className="w-36">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/learn-more" className="w-36">
              <Button size="lg" variant="outline" className="w-full">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-gray-600">
                Optimized performance that keeps your applications running at
                peak efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Secure by Default</h3>
              <p className="text-gray-600">
                Enterprise-grade security features to protect your data and
                users.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-4 pt-6">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-gray-600">
                Built for teams with powerful collaboration tools and workflows.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
