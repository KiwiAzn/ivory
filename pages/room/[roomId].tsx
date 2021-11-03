import { Container } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { diceRollsAtom, DiceRoll } from "../../components/atoms";
import DiceRollerServer from "../../components/DiceRollerServer";
import Hero from "../../components/Hero";
import LightModeToggle from "../../components/LightModeToggle";
import getConfig from "next/config";
import { useHydrateAtoms } from "jotai/utils";
import savedDiceRollsAtom, {
  SavedDiceRoll,
} from "../../components/atoms/savedDiceRollsAtom";

const DynamicNameModalOpener = dynamic(
  () => import("../../components/NameModal/NameModalOpener"),
  { ssr: false }
);

interface Props {
  diceRolls: Array<DiceRoll>;
}

const Room: NextPage<Props> = ({ diceRolls }) => {
  const diceRollsInitialState: [typeof diceRollsAtom, DiceRoll[]] = [
    diceRollsAtom,
    diceRolls.map(({ rolledAt, ...other }) => ({
      rolledAt: new Date(rolledAt),
      ...other,
    })),
  ];

  useHydrateAtoms([diceRollsInitialState]);

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

  const { serverRuntimeConfig } = getConfig();
  const { backendAddress } = serverRuntimeConfig;
  const endpoint = `${backendAddress}/room/${roomId}/diceRolls`;

  const response = await fetch(endpoint);

  const diceRolls = (await response.json()) ?? [];

  return {
    props: { diceRolls }, // will be passed to the page component as props
  };
};

export default Room;
