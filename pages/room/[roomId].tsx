import { Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import DiceRoller from "../../components/DiceRoller";
import Hero from "../../components/Hero";
import LightModeToggle from "../../components/LightModeToggle";

const DynamicNameModalOpener = dynamic(
  () => import("../../components/NameModal/NameModalOpener"),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Ivory - RPG dice roller built for the web</title>
        <meta
          name="description"
          content="Ivory is a RPG dice rolling app built for the web"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <LightModeToggle pos="absolute" right="4" top="4" />
      <Container>
        <Hero />
        <DiceRoller />
      </Container>
      <DynamicNameModalOpener />
    </div>
  );
};

export default Home;
