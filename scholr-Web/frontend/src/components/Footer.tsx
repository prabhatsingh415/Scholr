import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
const Footer = () => {
    return (<footer className="bg-card text-card-foreground relative">
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <div className="mt-8">
              <p className="uppercase text-muted-foreground text-xs mb-2">Degrees Awarded by:</p>
              <img className="max-h-12 h-auto w-auto" src="/images/RTU LOGO 2.png" alt="RTU University Logo"/>
            </div>
          
           
            <div className="flex space-x-4">
              <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                <Facebook className="w-4 h-4"/>
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                <Twitter className="w-4 h-4"/>
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                <Instagram className="w-4 h-4"/>
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                <Linkedin className="w-4 h-4"/>
              </Button>
            </div>

            
            
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</a></li>
              <li><a href="/apply" className="text-muted-foreground hover:text-primary transition-colors">Admissions</a></li>
              <li><a href="#student-life" className="text-muted-foreground hover:text-primary transition-colors"></a></li>
              <li><a href="#research" className="text-muted-foreground hover:text-primary transition-colors"></a></li>
              <li><a href="#news" className="text-muted-foreground hover:text-primary transition-colors">News & Events</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
             
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#library" className="text-muted-foreground hover:text-primary transition-colors">Library</a></li>
              <li><a href="#alumni" className="text-muted-foreground hover:text-primary transition-colors"></a></li>
              <li><a href="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-lg mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0"/>
                <div>
                  <p className="text-muted-foreground">Government Engineering College, Baran</p>
                  <p className="text-muted-foreground">Baran, Rajasthan, India</p>
                  <p className="text-muted-foreground">Pin: 325205</p>
                  
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0"/>
    <a href="tel:94148101144, 9928709032" class="text-primary font-serif text-xl"> 94148101144, 9928709032  </a>    </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0"/>
                <a href="mailto: principalgecbaran@gmail.com" target="_blank" rel="noopener">principalgecbaran@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 University College. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#accessibility" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>);
};
export default Footer;
