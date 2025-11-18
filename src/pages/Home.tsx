import React from "react";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Chatbot from "@/components/Chatbot";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-pulse"></div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Shivam Modi
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-foreground-secondary font-light">
                Full-Stack Developer & Social Contributor
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Passionate about creating innovative web solutions and making a
                positive impact through technology and social work.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary-hover shadow-soft hover:shadow-glow transition-all"
              >
                <Link to="/projects">
                  View Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-secondary transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  View Resume
                </Button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://github.com/shivammodi1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:bg-secondary transition-all"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </a>

              <a
                href="https://codolio.com/profile/Shivam-modi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:bg-secondary transition-all"
                >
                  <img src="/codolio.png" className="h-10 w-10 text-white" />
                </Button>
              </a>


              <a
                href="https://www.linkedin.com/in/shivammodi1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:bg-secondary transition-all"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>

              <a href="mailto:smodi9846@gmail.com"> 
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110 hover:bg-secondary transition-all"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Content - Animated Element */}
          <div className="relative animate-slide-up">
            <div className="relative w-full max-w-md mx-auto">
              {/* Floating Cards */}
              <div className="absolute inset-0 animate-float">
                <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-hero rounded-xl shadow-glow opacity-20"></div>
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-card rounded-2xl shadow-soft border border-border animate-pulse"></div>
              </div>

              {/* Main Visual */}
              <div className="relative bg-card rounded-3xl p-8 shadow-strong border border-border hover-lift">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    SM
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Ready to Connect?</h3>
                    <p className="text-muted-foreground">
                      Click the chat icon to learn more!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2 animate-scale-in hover-lift">
              <h3 className="text-3xl font-bold text-primary">3rd Year</h3>
              <p className="text-muted-foreground">B.Tech CSE Student</p>
            </div>
            <div
              className="text-center space-y-2 animate-scale-in hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-3xl font-bold text-primary">10+</h3>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div
              className="text-center space-y-2 animate-scale-in hover-lift"
              style={{ animationDelay: "0.4s" }}
            >
              <h3 className="text-3xl font-bold text-primary">2+</h3>
              <p className="text-muted-foreground">Certifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Home;
