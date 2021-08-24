import { Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import DiceRoller from "../components/DiceRoller";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ivory - RPG dicer roller built for the web</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    <Container>
      <Hero/>
      <DiceRoller></DiceRoller>
    </Container>
    </div>
  );
};

export default Home;