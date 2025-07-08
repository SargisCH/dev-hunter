import { useState } from "react";
import { toast, Toaster } from "sonner";
import "./App.css";
import logo from "./assets/logo.svg";
import { Button } from "./components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSubscriptionCandidates,
  getSubscriptions,
} from "./api/subscription";
import { generateCandidates } from "./api/cadidate";
import Spinner from "./components/ui/spinner";
import { useSocket } from "./hooks/useSocket";
import CandidateCard from "./components/CandidateCard";
import CreateSubscription from "./components/CreateSubscription";
import SubscriptionCard from "./components/SubscriptionCard";

function App() {
  const [selectedSubscription, setSelectedSubscription] = useState<string>();

  if (!localStorage.getItem("clientId")) {
    // setting something ad clientid
    const id = "id" + Math.random().toString(16).slice(2);
    localStorage.setItem("clientId", id);
  }

  const generatCandidatesMutation = useMutation({
    mutationFn: () => generateCandidates(),
  });

  const { data: subscriptions, refetch } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptions(),
  });

  const { data: subscriptionCandidates, isLoading } = useQuery({
    queryKey: ["subscriptionCandidates", selectedSubscription],
    queryFn: () => getSubscriptionCandidates(selectedSubscription ?? ""),
    enabled: !!selectedSubscription, // only run query when `selected` is truthy
  });

  useSocket({
    namespace: "",
    onMessage: (msgObject) => {
      toast.success(msgObject.message);
    },
    onConnect: (id) => console.log("Client ID:", id),
  });

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "teal",
            color: "white",
          },
        }}
      />
      <header className="h-[80px]">
        <div className="justify-between flex">
          <img src={logo} alt="logo" />
          <Button
            onClick={() => {
              generatCandidatesMutation.mutate();
            }}
          >
            Generate candidates
          </Button>
        </div>
      </header>
      <main>
        <h1 className="mt-6 font-bold text-left"> Welcome to Dev Hunter</h1>
        <div className="grid grid-cols-4 gap-4 mt-10">
          <CreateSubscription refetchSubscriptions={refetch} />
          <div className="col-span-3 grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {subscriptions?.map((subscription, index) => {
              return (
                <SubscriptionCard
                  key={index}
                  selectedSubscription={selectedSubscription}
                  subscription={subscription}
                  onSubscriptionSelect={(subscriptionId) =>
                    setSelectedSubscription(subscriptionId)
                  }
                />
              );
            })}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            {subscriptionCandidates?.length ? (
              <div>
                <h4 className="font-weight-bold mt-6 text-left">Candidates</h4>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {subscriptionCandidates.map((candidate, index) => {
                    const subscription = subscriptions?.find(
                      (sub) => sub._id === selectedSubscription,
                    );
                    return (
                      <CandidateCard
                        key={index}
                        candidate={candidate}
                        subscription={subscription}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
