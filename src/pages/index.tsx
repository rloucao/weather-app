import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

import { api } from "~/utils/api";

import Weather from "./weather";
import { useRouter } from "next/router";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const rout = useRouter();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      console.log(`user ${value} created with success`);
    },
    onError: () => {
      console.log(`error creating user ${value}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      createUser.mutate({
        name: value,
      });
      setValue("");
    }
  };

  return (
    <main className="bg-slate-950 text-cyan-50">
      <button onClick={() => rout.push("/weather")}>Weather Forecast</button>
    </main>
  );
}
