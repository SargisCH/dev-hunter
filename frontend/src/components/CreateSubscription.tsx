import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { createSubscriptions } from "@/api/subscription";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/api/queryClient";
import { toast } from "sonner";

type Props = { refetchSubscriptions: () => {} };

const OPTIONS: Array<{ label: string; value: string }> = [
  { label: "nextjs", value: "next" },
  { label: "React", value: "react" },
  { label: "Nodejs", value: "node" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember" },
  { label: "Gatsby", value: "gatsby" },
  { label: "Astro", value: "astro" },
];
export default function CreateSubscription({ refetchSubscriptions }: Props) {
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [languages, setSelectedLanguages] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>();
  const [position, setPosition] = useState<string>();
  const { mutate, data } = useMutation({
    onSuccess: () => {
      refetchSubscriptions();
    },
    mutationFn: (body: {
      experience?: string;
      skills?: string[];
      position?: string;
      minSalary?: number | string;
      maxSalary?: number | string;
    }) => createSubscriptions(body),
    onError: (error) => {
      const message = error.message || error;
      toast.error(`Error: ${message}`);
    },
  });
  useEffect(() => {
    if (data) {
      const subscriptionId = data?._id;
      if (!subscriptionId) {
        if (data.error)
          toast(`No subscription data returned. Error: ${data.message}`);
        return;
      }
      setSelectedLanguages(subscriptionId);
    }
  }, [data]);
  return (
    <div>
      <div>
        <Label>Tech languages</Label>
        <div className="mt-4 w-[350px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Select language
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {OPTIONS.map((option) => {
                const selected = languages.includes(option.value);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selected}
                    onCheckedChange={() => {
                      if (selected) {
                        setSelectedLanguages(
                          languages.filter((l) => l !== option.value),
                        );
                      } else {
                        setSelectedLanguages([...languages, option.value]);
                      }
                    }}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4">
        <Label>Experience</Label>
        <div className="mt-4">
          <Select
            onValueChange={(v) => {
              setExperience(v);
            }}
          >
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="principal">Principal</SelectItem>
              <SelectItem value="architect">Architect</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 w-[350px]">
        <Label>Salary Range</Label>
        <div className="mt-4 flex">
          <Input
            type="number"
            placeholder="min"
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
          />
          <div className="ml-2 mr-2"> - </div>
          <Input
            type="number"
            placeholder="max"
            value={maxSalary}
            onChange={(e) => setMaxSalary(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Position</Label>
        <div className="mt-4">
          <Select onValueChange={(v) => setPosition(v)}>
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullstack">Full stack</SelectItem>
              <SelectItem value="frontend">Front end</SelectItem>
              <SelectItem value="backend">Back end</SelectItem>
              <SelectItem value="db_engineer">DB negineer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-left">
        <Button
          className="mt-4 sefl-center"
          onClick={() => {
            mutate({
              experience,
              skills: languages,
              position,
              minSalary,
              maxSalary,
            });
          }}
        >
          Create Subscription
        </Button>
      </div>
    </div>
  );
}
