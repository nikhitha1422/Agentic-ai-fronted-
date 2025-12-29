
import { Link } from 'react-router-dom'
import { Linkedin, Github, Youtube } from 'lucide-react'
export function Footer() {
  return (
    <footer className="bg-[#F1F3F4] border-t border-gray-200 mt-20">
      <div className="max-w-[1440px] mx-auto px-12 py-8">
        <div className="flex items-center justify-between">
          {/* Copyright */}
          <div className="text-sm text-[#5F6368]">
            © 2025 Agentic AI for Meetings
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-sm text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              About
            </Link>
            <Link
              to="/agents"
              className="text-sm text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              Agents
            </Link>
            <Link
              to="/contact"
              className="text-sm text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/terms"
              className="text-sm text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-[#5F6368] hover:text-[#202124] transition-colors"
            >
              Privacy
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-[#5F6368] hover:text-[#1A73E8] transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="text-[#5F6368] hover:text-[#1A73E8] transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-[#5F6368] hover:text-[#1A73E8] transition-colors"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
