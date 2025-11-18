import React, { useRef } from "react";
import { ExternalLink, Github, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  image: string;
}

const Projects: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // My Projects
  const projects: Project[] = [
    {
      id: 1,
      title: "FoodHub",
      description:
        "A MERN-based food ordering and management application with authentication, food item management, order tracking, and secure payment integration.",
      technologies: [
        "MongoDB",
        "Express.js",
        "React",
        "Node.js",
        "TailwindCSS",
      ],
      githubUrl: "https://github.com/shivammodi001/FoodHub",
      liveUrl: "https://foodhub-frontend-yl92.onrender.com/", 
      image: "/foodhub.png",
    },
    {
      id: 2,
      title: "EliteCode",
      description:
        "An online coding platform where users can practice coding problems, submit solutions, and improve their problem-solving skills.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      githubUrl: "https://github.com/shivammodi001/EliteCode",
      liveUrl: "#",
      image: "/elitecode.png",
    },
    {
      id: 3,
      title: "Socket Chat",
      description:
        "A real-time chat application built with WebSockets that allows multiple users to communicate instantly with features like online status and message history.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      githubUrl: "https://github.com/shivammodi001/chat-app",
      liveUrl: "https://chat-app-epcp.onrender.com/",
      image: "/socket-chat.png",
    },
    {
      id: 3,
      title: "Virtual Assistant",
      description:
        "A sophisticated AI-powered virtual assistant built with React.js frontend and Express.js backend, integrated with MongoDB. The assistant supports voice recognition, text-to-speech, and intelligent command handling using Google’s Gemini AI.",
      technologies: ["MongoDB",
        "Express.js",
        "React",
        "Node.js",
        "TailwindCSS",],
      githubUrl: "https://github.com/shivammodi001/Virtual-Assistance",
      liveUrl: "https://virtual-assistance-y2eo.onrender.com/",
      image: "virtualAssistant.png",
    },
    {
      id: 5,
      title: "Swiggy Clone",
      description:
        "A food delivery web application inspired by Swiggy, featuring restaurant listings, menu browsing, cart management, and order checkout.",
      technologies: ["React", "Redux", "Firebase", "Tailwind CSS"],
      githubUrl: "https://github.com/shivammodi001/Swiggy_Clone",
      liveUrl: "https://swiggy-clone-orpin.vercel.app/",
      image: "/swiggy-clone.png",
    },
    {
      id: 6,
      title: "YouTube Clone",
      description:
        "A video streaming platform that replicates core YouTube features like video browsing, search, likes, comments, and responsive UI.",
      technologies: ["React", "TypeScript", "YouTube API", "Tailwind CSS"],
      githubUrl: "https://github.com/shivammodi",
      liveUrl: "https://example.com",
      image: "/youtube-clone.png",
    },
    {
      id: 7,
      title: "Agri ChatBot",
      description:
        "An AI-powered chatbot designed for farmers to provide crop suggestions, weather updates, and basic farming tips in regional languages.",
      technologies: ["Python", "Flask", "Dialogflow", "MongoDB"],
      githubUrl: "https://github.com/shivammodi001/Agri_Help",
      liveUrl: "https://shivammodi001.github.io/Agri_Help/",
      image: "/agri-chatbot.png",
    },
    {
      id: 8,
      title: "TicTacToe Game",
      description:
        "A classic TicTacToe game with multiplayer support and interactive UI, built for fun and learning game logic implementation.",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com/shivammodi001/TicTacToe",
      liveUrl: "https://shivammodi001.github.io/TicTacToe/",
      image: "/tictactoe.png",
    },
    {
      id: 9,
      title: "Calculator",
      description:
        "A simple calculator application built with HTML, CSS, and JavaScript, featuring basic arithmetic operations and a user-friendly interface.",
      technologies: ["HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com/shivammodi001/Calculator",
      liveUrl: "https://shivammodi001.github.io/Calculator/",
      image: "/calculator.png",
    },

    
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isScrolling) return;

    const scroll = () => {
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [isScrolling]);

  const toggleScrolling = () => {
    setIsScrolling(!isScrolling);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A showcase of my full-stack development projects, demonstrating
            expertise in modern web technologies and problem-solving
            capabilities.
          </p>

          {/* Auto-scroll Control */}
          <div className="flex justify-center">
            <Button
              onClick={toggleScrolling}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isScrolling ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isScrolling ? "Pause" : "Play"} Auto-scroll</span>
            </Button>
          </div>
        </div>

        {/* Projects Carousel */}
        <div className="relative mb-16">
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollBehavior: "smooth" }}
            onMouseEnter={() => setIsScrolling(false)}
            onMouseLeave={() => setIsScrolling(true)}
          >
            {projects.concat(projects).map((project, index) => (
              <Card
                key={`${project.id}-${index}`}
                className="flex-shrink-0 w-80 hover-lift hover-glow transition-all duration-300 animate-scale-in"
                style={{
                  animationDelay: `${(index % projects.length) * 0.1}s`,
                }}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                        {project.liveUrl && (
                          <Button size="sm" variant="secondary" asChild>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-3">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-slide-up">
          <h2 className="text-2xl font-bold mb-4">Want to see more?</h2>
          <p className="text-muted-foreground mb-6">
            Check out my GitHub profile for additional projects and
            contributions.
          </p>
          <Button asChild size="lg" className="shadow-soft hover:shadow-glow">
            <a
              href="https://github.com/shivammodi1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-5 w-5" />
              Visit GitHub Profile
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
