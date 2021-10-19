import { Container } from "@chakra-ui/react";
import { useAtom } from "jotai";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import { diceRollsAtom, DiceRoll } from "../../components/atoms";
import DiceRollerServer from "../../components/DiceRollerServer";
import Hero from "../../components/Hero";
import LightModeToggle from "../../components/LightModeToggle";

const DynamicNameModalOpener = dynamic(
  () => import("../../components/NameModal/NameModalOpener"),
  { ssr: false }
);

interface Props {
  diceRolls: Array<DiceRoll>;
}

const Room: NextPage<Props> = ({ diceRolls }) => {
  const [_diceRolls, setDiceRolls] = useAtom(diceRollsAtom);
  useEffect(() => {
    setDiceRolls(diceRolls);
  }, [setDiceRolls, diceRolls]);

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
        <DiceRollerServer />
      </Container>
      <DynamicNameModalOpener />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params) {
    return { props: {} };
  }

  const { roomId } = params;
  const response = await fetch(
    `http://localhost:8080/room/${roomId}/diceRolls`
  );
  const diceRolls = await response.json();

  return {
    props: { diceRolls }, // will be passed to the page component as props
  };
};

export default Room;
