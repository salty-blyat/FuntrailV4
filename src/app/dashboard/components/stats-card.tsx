import { Progress } from "@components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
// Define the props type
interface StatsCardProps {
  description: string;
  title: string;
  percentage: number;
  progressValue: number;
  duration?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  description,
  title,
  percentage = 0,
  progressValue = 0,
  duration = "week",
}) => { 
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-4xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {percentage > 0 ? `+${percentage}%` : `${percentage}%`} from{" "}
          {duration}
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={progressValue}
          aria-label={`${progressValue}% ${
            percentage > 0 ? "increase" : "decrease"
          }`}
          style={{
            backgroundColor: percentage < 0 ? "red" : "green",
          }}
        />
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
