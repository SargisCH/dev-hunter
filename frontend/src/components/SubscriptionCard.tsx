import { addCandidatesForSubscription } from "@/api/subscription";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
type Props = {
  onSubscriptionSelect: (subscriptionId: string) => void;
  selectedSubscription?: string;
  subscription: {
    _id: string;
    skills?: string[];
    experience?: string;
    position?: string;
    minSalary?: string;
    maxSalary?: string;
    newCandidates?: number;
    totalCandidates?: number;
  };
};
export default function SubscriptionCard({
  subscription,
  onSubscriptionSelect,
  selectedSubscription,
}: Props) {
  const addCandidatesForSubscriptionMutation = useMutation({
    mutationFn: (subscriptionId: string) =>
      addCandidatesForSubscription(subscriptionId),
    onError: (error: any) => {
      const message = error?.message || error;
      toast.error(`Something went wrong. Please try again. Error: ${message}`);
    },
  });
  return (
    <Card
      onClick={() => onSubscriptionSelect(subscription._id)}
      selected={subscription._id === selectedSubscription}
      key={subscription._id}
      className="px-4 w-[350px] ml-6"
    >
      <p className="text-gray-600 text-left text-xs">
        Total candidates {subscription.totalCandidates || 0} | New candidates{" "}
        {subscription.newCandidates || 0}
      </p>
      <div className="mt-2 text-left">
        <h4>Tech languages</h4>
        {subscription?.skills?.map((skill: string, index: number) => (
          <Badge className="ml-4 mt-2 outline" variant="outline" key={index}>
            {skill}
          </Badge>
        ))}
      </div>
      <div className="mt-4 text-left">
        <h4>Experience</h4>
        <Badge className="ml-4 mt-2 outline" variant="outline">
          {subscription.experience}
        </Badge>
      </div>
      <div className="mt-2 text-left">
        <h4>Salary range</h4>
        <div className="flex items-center">
          <Badge className="ml-4 mt-2 outline" variant="outline">
            {subscription.minSalary}
          </Badge>
          <div className="mx-2">-</div>
          <Badge className="mt-2 outline" variant="outline">
            {subscription.maxSalary}
          </Badge>
        </div>
      </div>
      <div className="mt-2 text-left">
        <h4>Position</h4>
        <Badge className="ml-4 mt-2 outline" variant="outline">
          {subscription.position}
        </Badge>
      </div>

      <div>
        <Button
          title="Add 5 candidates matching these conditions"
          onClick={() =>
            addCandidatesForSubscriptionMutation.mutate(subscription._id)
          }
        >
          Add candidates
        </Button>
      </div>
    </Card>
  );
}
