import type {InfoLdg} from "@/types";
import {t} from "i18next";

export const infos: InfoLdg[] = [
  {
    title: "Empower your projects",
    description:
      "Unlock the full potential of your projects with our open-source SaaS platform. Collaborate seamlessly, innovate effortlessly, and scale limitlessly.",
    image: "/images/blog/placeholder-about.jpg",
    list: [
      {
        title: "Collaborative",
        description: "Work together with your team members in real-time.",
        icon: "lucide:laptop",
      },
      {
        title: "Innovative",
        description: "Stay ahead of the curve with access constant updates.",
        icon: "lucide:settings",
      },
      {
        title: "Scalable",
        description:
          "Our platform offers the scalability needed to adapt to your needs.",
        icon: "lucide:search",
      },
    ],
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate our open-source SaaS seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/images/blog/placeholder-about.jpg",
    list: [
      {
        title: "Flexible",
        description:
          "Customize your integrations to fit your unique requirements.",
        icon: "lucide:laptop",
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "lucide:search",
      },
      {
        title: "Reliable",
        description:
          "Rely on our robust infrastructure and comprehensive documentation.",
        icon: "lucide:settings",
      },
    ],
  },
];

export const features = [
  {
    title: t("Index.feature1"),
    description: t("Index.feature1Desc"),
    link: "/",
    icon: "wasm",
  },
  {
    title: t("Index.feature2"),
    description: t("Index.feature2Desc"),
    link: "/",
    icon: "lucide:images",
  },
  {
    title: t("Index.feature3"),
    description: t("Index.feature3Desc"),
    link: "/",
    icon: "lucide:shield-check",
  },
];

export const testimonials = [
  {
    name: "John Doe",
    job: "Full Stack Developer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "The next-saas-stripe-starter repo has truly revolutionized my development workflow. With its comprehensive features and seamless integration with Stripe, I've been able to build and deploy projects faster than ever before. The documentation is clear and concise, making it easy to navigate through the setup process. I highly recommend next-saas-stripe-starter to any developer.",
  },
  {
    name: "Alice Smith",
    job: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "Thanks to next-saas-stripe-starter, I've been able to create modern and attractive user interfaces in record time. The starter kit provides a solid foundation for building sleek and intuitive designs, allowing me to focus more on the creative aspects of my work.",
  },
  {
    name: "David Johnson",
    job: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "Thanks to next-saas-stripe-starter, I was able to streamline the entire process and get payments up and running in no time.",
  },
  {
    name: "Michael Wilson",
    job: "Project Manager",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "I'm impressed by the quality of code and clear documentation of next-saas-stripe-starter. Kudos to the team!",
  },
  {
    name: "Sophia Garcia",
    job: "Data Analyst",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    review:
      "next-saas-stripe-starter provided me with the tools I needed to efficiently manage user data. Thank you so much!",
  },
  {
    name: "Emily Brown",
    job: "Marketing Manager",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "next-saas-stripe-starter has been an invaluable asset in my role as a marketing manager. With its seamless integration with Stripe, I've been able to launch targeted marketing campaigns with built-in payment functionality, allowing us to monetize our products and services more effectively.",
  },
];