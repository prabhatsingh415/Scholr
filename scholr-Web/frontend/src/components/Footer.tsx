import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (<footer className="relative bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="mt-2 sm:mt-8">
              <p className="mb-2 text-xs uppercase text-muted-foreground">Degrees Awarded by:</p>
              <img className="h-auto max-h-12 w-auto" src="/images/RTU LOGO 2.png" alt="RTU University Logo"/>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <Button size="sm" variant="outline" className="h-10 w-10 p-0">
                <Facebook className="h-4 w-4"/>
              </Button>
              <Button size="sm" variant="outline" className="h-10 w-10 p-0">
                <Twitter className="h-4 w-4"/>
              </Button>
              <Button size="sm" variant="outline" className="h-10 w-10 p-0">
                <Instagram className="h-4 w-4"/>
              </Button>
              <Button size="sm" variant="outline" className="h-10 w-10 p-0">
                <Linkedin className="h-4 w-4"/>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-muted-foreground transition-colors hover:text-primary">About Us</a></li>
              <li><a href="/#courses" className="text-muted-foreground transition-colors hover:text-primary">Courses</a></li>
              <li><a href="/apply" className="text-muted-foreground transition-colors hover:text-primary">Admissions</a></li>
              <li><a href="#student-life" className="text-muted-foreground transition-colors hover:text-primary"></a></li>
              <li><a href="#research" className="text-muted-foreground transition-colors hover:text-primary"></a></li>
              <li><a href="/events" className="text-muted-foreground transition-colors hover:text-primary">News & Events</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact Us</a></li>
              <li><a href="#careers" className="text-muted-foreground transition-colors hover:text-primary">Careers</a></li>
              <li><a href="#library" className="text-muted-foreground transition-colors hover:text-primary">Library</a></li>
              <li><a href="#alumni" className="text-muted-foreground transition-colors hover:text-primary"></a></li>
              <li><a href="/student-portal" className="text-muted-foreground transition-colors hover:text-primary">Student Portal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-semibold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary"/>
                <div>
                  <p className="text-muted-foreground">Government Engineering College, Baran</p>
                  <p className="text-muted-foreground">Baran, Rajasthan, India</p>
                  <p className="text-muted-foreground">Pin: 325205</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary"/>
                <a href="tel:9460013249" className="break-words text-base font-semibold text-primary sm:text-lg">9460013249</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary"/>
                <a href="mailto:principalgecbaran@gmail.com" target="_blank" rel="noopener" className="break-all text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base">principalgecbaran@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2024 University College. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end md:gap-6">
              <a href="#privacy" className="text-muted-foreground transition-colors hover:text-primary">Privacy Policy</a>
              <a href="#terms" className="text-muted-foreground transition-colors hover:text-primary">Terms of Service</a>
              <a href="#accessibility" className="text-muted-foreground transition-colors hover:text-primary">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>);
};

export default Footer;
