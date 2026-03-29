import { ArrowRight, Award, BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { courseSections, type CourseProgramKey } from "@/data/course-sections";

type CourseProgramDetailsProps = {
    programKey: CourseProgramKey;
};

const fallbackCourseImage = encodeURI("/images/1.jpg");

const normalizeCourseImageSrc = (path: string) => {
    if (!path?.trim()) {
        return fallbackCourseImage;
    }
    return encodeURI(path);
};

const CourseProgramDetails = ({ programKey }: CourseProgramDetailsProps) => {
    const program = courseSections[programKey];
    const otherProgramKey: CourseProgramKey = programKey === "BTECH" ? "BCA" : "BTECH";
    const IconComponent = program.icon;

    return (<div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />

      <section className="px-4 pb-16 pt-32 sm:pb-20">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6 flex justify-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r shadow-xl ${program.color}`}>
              <IconComponent className="h-10 w-10 text-white"/>
            </div>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
            {program.title}
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {program.description}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 hover:scale-105" onClick={() => window.location.href = "/apply"}>
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"/>
            </Button>
            <Button size="lg" variant="outline" className="transition-all duration-300 hover:scale-105" onClick={() => window.location.href = `/courses/${otherProgramKey.toLowerCase()}`}>
              View {courseSections[otherProgramKey].title}
            </Button>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary"/>
              <span>{program.branches.length} Specialized Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary"/>
              <span>Industry-ready curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary"/>
              <span>Career-focused outcomes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {program.branches.map((course) => (<Card key={course.id} className={`group overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${course.featured ? "ring-2 ring-primary shadow-xl" : "shadow-lg"}`}>
                {course.featured && (<div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                    Featured
                  </div>)}

                <div className="relative h-52 overflow-hidden">
                  <img src={normalizeCourseImageSrc(course.image)} alt={course.title} onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackCourseImage;
            }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                    {course.duration}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">{course.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>

                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">Key Subjects:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.subjects.map((subject) => (<span key={subject} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                          {subject}
                        </span>))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4"/>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4"/>
                      <span>{course.students} students</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80" onClick={() => window.location.href = "/apply"}>
                    Apply for this program
                    <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                </CardFooter>
              </Card>))}
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};

export default CourseProgramDetails;
