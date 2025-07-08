import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  subscription: {
    _id: string;
    skills?: string[];
    experience?: string;
    position?: string;
    minSalary?: string;
    maxSalary?: string;
  };
  candidate: {
    name: string;
    skills?: string[];
    experience?: string;
    position?: string;
    salary?: string;
    new?: boolean;
  };
};

const isMatched = (skill: string, candidateSkills: string[]) =>
  candidateSkills?.includes(skill);

export default function CandidateCard({ candidate, subscription }: Props) {
  return (
    <Card className="p-4">
      <p className="text-gray-600 text-left">{candidate.name}</p>
      {candidate?.new ? <Badge>New</Badge> : null}
      <div className="mt-2 text-left">
        <h4>Tech languages</h4>
        {subscription?.skills?.map((skill: string, index: number) => (
          <Badge
            className={cn(
              "ml-4 mt-2 outline",
              isMatched(skill, candidate?.skills as [])
                ? "outline-teal-400"
                : "",
            )}
            variant="outline"
            key={index}
          >
            {skill}
          </Badge>
        ))}
      </div>
      <div className="mt-4 text-left">
        <h4>Experience</h4>
        <Badge
          className={cn(
            "ml-4 mt-2 outline outline-green-500",
            candidate.experience === subscription._id ? "outline-teal-700" : "",
          )}
          variant="outline"
        >
          {candidate.experience}
        </Badge>
      </div>
      <div className="mt-2 text-left">
        <h4>Salary range</h4>
        <div className="flex items-center">
          <Badge
            className={cn(
              candidate.salary < subscription?.maxSalary &&
                candidate.salary > subscription?.minSalary
                ? "outline-teal-400"
                : "",
              "ml-4 mt-2 outline",
            )}
            variant="outline"
          >
            {subscription.minSalary}
            <span> - </span>
            {subscription.maxSalary}
          </Badge>
        </div>
      </div>
      <div className="mt-2 text-left">
        <h4>Position</h4>
        <Badge
          className={cn(
            "ml-4 mt-2 outline",
            candidate.position === subscription.position
              ? "outline-teal-400"
              : "",
          )}
          variant="outline"
        >
          {candidate.position}
        </Badge>
      </div>
    </Card>
  );
}
