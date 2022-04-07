import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <main className="p-5">
        <h1 className="text-center text-3xl">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <h1 className="text-center text-3xl font-bold">
          Hello Tailwind, you so cute 🧡!
        </h1>
      </main>
    </div>
  );
};

export default Home;
