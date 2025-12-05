import { useLiveQuery } from "dexie-react-hooks";
import {
  ExternalLinkIcon,
  FilmIcon,
  HeartIcon,
  PlayIcon,
  SparklesIcon,
  VideoIcon
} from "lucide-react";
import { isEmpty, take } from "lodash-es";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  Separator,
  OldProjectorBackground
} from "@/components";
import { db } from "@/config";
import { dayjs, openProjectFromComputer, openProjectFromRecent } from "@/utils";

export function Welcome() {
  const recentProjects = useLiveQuery(() =>
    db.recentProjects.orderBy("updatedAt").reverse().toArray()
  );

  return (
    <ScrollArea className="h-screen">
      <OldProjectorBackground />

      <div className="relative mx-auto max-w-4xl space-y-12 px-6 py-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary opacity-20 blur-xl"></div>
              <img src="/logo.svg" alt="logo" className="size-16" />
            </div>
          </div>
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold text-foreground">FreeCut</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Video editing made simple. Edit, trim, and enhance your videos
              with our powerful yet intuitive interface. No subscriptions, no
              limits.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg">
              <PlayIcon className="size-4" />
              Get Started
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/strblr/freecut"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="size-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            Start Creating
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full bg-accent p-3 transition-colors group-hover:bg-accent/80">
                  <FilmIcon
                    strokeWidth={1}
                    className="size-8 text-accent-foreground"
                  />
                </div>
                <CardTitle className="text-lg">New Project</CardTitle>
                <CardDescription>Start from scratch</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="group cursor-pointer"
              onClick={openProjectFromComputer}
            >
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full bg-accent p-3 transition-colors group-hover:bg-accent/80">
                  <VideoIcon
                    strokeWidth={1}
                    className="size-8 text-accent-foreground"
                  />
                </div>
                <CardTitle className="text-lg">Open from Computer</CardTitle>
                <CardDescription>
                  Open projects from your filesystem
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full bg-primary p-3 transition-colors group-hover:bg-primary/90">
                  <SparklesIcon
                    strokeWidth={1}
                    className="size-8 text-primary-foreground"
                  />
                </div>
                <CardTitle className="text-lg">Open from db</CardTitle>
                <CardDescription>
                  Open projects from your local database
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {recentProjects && !isEmpty(recentProjects) && (
          <>
            <Separator />
            <div className="space-y-6">
              <h2 className="text-center text-2xl font-semibold text-foreground">
                Recent Projects
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {take(recentProjects, 6).map(project => (
                  <Card
                    key={project.id}
                    className="cursor-pointer"
                    onClick={() => openProjectFromRecent(project)}
                  >
                    <CardHeader>
                      <CardTitle className="flex min-w-0 items-center justify-between text-base">
                        <span className="truncate">{project.handle.name}</span>
                        {project.computer && (
                          <Badge variant="outline">Computer</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Last opened {dayjs(project.updatedAt).fromNow()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-6">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              Support FreeCut
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              FreeCut is free and open source. If you find it useful, consider
              supporting the project by becoming a sponsor or contributing.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <HeartIcon className="size-4" />
              Become a Sponsor
            </Button>
            <Button variant="ghost" asChild>
              <a
                href="https://github.com/strblr/freecut"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon className="size-4" />
                Contribute
              </a>
            </Button>
          </div>

          <div className="space-y-4 text-center">
            <h3 className="text-lg font-medium text-foreground">Sponsors</h3>
            <p className="text-muted-foreground italic">You'd be the first!</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
