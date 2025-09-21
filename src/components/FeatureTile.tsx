import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureTileProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const FeatureTile = ({ title, description, icon: Icon, href }: FeatureTileProps) => {
  return (
    <Card className="card-hover bg-card border-border/50 group">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <Icon className="h-8 w-8 text-secondary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
          <Button asChild variant="outline" className="mt-4 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-all">
            <Link to={href}>
              Explore
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureTile;