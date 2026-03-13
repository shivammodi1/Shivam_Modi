import React, { useEffect, useState } from "react";
import { ExternalLink, Award, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  certificateUrl?: string;
  skills: string[];
  verified: boolean;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
}

const Certifications: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const certifications: Certification[] = [
    {
      id: 1,
      title: "Certified Ethical Hacker (CEH) V12",
      issuer: "Warlock Security",
      date: "2024",
      description:
        "Comprehensive certification in ethical hacking and penetration testing, covering network security, vulnerability assessment, and security protocols.",
      certificateUrl: "https://drive.google.com/file/d/17xDK2jk36yRt_b2a2rSz3sa5o1mgdzdA/view?usp=sharing",
      skills: [
        "Ethical Hacking",
        "Penetration Testing",
        "Network Security",
        "Vulnerability Assessment",
      ],
      verified: true,
    },
    {
      id: 2,
      title: "Oracle Certified Professional – GenAI",
      issuer: "Oracle University",
      date: "2024",
      description:
        "Professional certification validating expertise in Generative AI concepts and practical implementations using Oracle technologies.",
      certificateUrl: "https://drive.google.com/file/d/1u5FC3Vt5swKx4wPSspjn7LN56kweYjfr/view?usp=sharing",
      skills: ["Generative AI", "Oracle Cloud", "AI Solutions"],
      verified: true,
    },
    {
      id: 3,
      title: "Full-Stack Web Development",
      issuer: "University Coursework",
      date: "2023",
      description:
        "Comprehensive training in modern web development technologies including React, Node.js, and database management.",
      skills: ["React", "Node.js", "MongoDB", "Full-Stack Development"],
      verified: true,
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      issuer: "University Coursework",
      date: "2023",
      description:
        "Advanced coursework in data structures, algorithms, and computational problem-solving techniques.",
      skills: ["Data Structures", "Algorithms", "Problem Solving", "Optimization"],
      verified: true,
    },
    {
  id: 5,
  title: "Winner – Paranox 2.0 National Level Hackathon",
  issuer: "TechXNinjas | Newton School of Technology, Sonipat",
  date: "Nov 2025",
  description:
    "Won the Paranox 2.0 National Level Hackathon held at Newton School of Technology, Sonipat, Haryana. Competed against thousands of participants from colleges across India and developed an innovative solution during the grand finale hackathon event.",
  certificateUrl: "https://www.linkedin.com/posts/shivammodi1_paranox2-winner-nationalhackathon-activity-7396210919103512576-uDhU",
  skills: [
    "Hackathon Development",
    "Innovation",
    "Problem Solving",
    "Full Stack Development",
    "Team Collaboration"
  ],
  verified: true,
}
  ];

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles: Bubble[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 25 + 10,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));
    setBubbles(initialBubbles);
  }, []);

  // Animate bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          let newX = b.x + b.vx;
          let newY = b.y + b.vy;
          let newVx = b.vx;
          let newVy = b.vy;

          if (newX <= 0 || newX >= window.innerWidth - b.size) newVx = -b.vx;
          if (newY <= 0 || newY >= window.innerHeight - b.size) newVy = -b.vy;

          return {
            ...b,
            x: Math.max(0, Math.min(newX, window.innerWidth - b.size)),
            y: Math.max(0, Math.min(newY, window.innerHeight - b.size)),
            vx: newVx,
            vy: newVy,
          };
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden bg-white dark:bg-black">
      {/* Floating Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 opacity-20 dark:from-purple-400 dark:via-pink-500 dark:to-red-500 dark:opacity-20"
            style={{ width: b.size, height: b.size, left: b.x, top: b.y }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent dark:text-white">
            Certifications & Achievements
          </h1>
          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
            Professional certifications and educational achievements that
            validate my expertise in cybersecurity, databases, and modern web
            technologies.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {certifications.map((cert) => (
            <Card
              key={cert.id}
              className="hover-lift hover-glow transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      {cert.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2 dark:text-white">{cert.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground dark:text-gray-300">
                      <span className="font-medium">{cert.issuer}</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{cert.date}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground dark:text-gray-300 mb-4 leading-relaxed">
                  {cert.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-200 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {cert.certificateUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> View Certificate
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coding Profiles Section */}
        <div className="text-center animate-fade-in mt-12">
          <h2 className="text-3xl font-bold mb-6">Coding Profiles</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "LeetCode",
                url: "https://leetcode.com/u/shivam-modi001/",
                logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
              },
              {
                name: "GeeksforGeeks",
                url: "https://www.geeksforgeeks.org/user/smodi9kat/?_gl=1*em1395*_up*MQ..*_gs*MQ..&gclid=CjwKCAjw2vTFBhAuEiwAFaScwr8UOHhSkmWWhR1T21WT_LXzS29uAFASL2YJW8UUF8FQbPJRW7cpvRoCNiwQAvD_BwE&gbraid=0AAAAAC9yBkDoY-k9aiEG7_BQlzauXv-3B",
                logo: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200X200.png",
              },
              {
                name: "CodeChef",
                url: "https://www.codechef.com/users/shivammodi001",
                logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/CodeChef_Logo.svg",
              },
             
            ].map((profile, index) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-secondary/50 rounded-lg border-2 border-dashed border-muted flex flex-col items-center justify-center hover:border-primary transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={profile.logo}
                  alt={profile.name}
                  className="h-12 mb-2"
                />
                <h3 className="font-medium text-muted-foreground">
                  {profile.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Check Profile
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
