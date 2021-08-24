import { Box, Center, Container, Heading, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Container>
      <Center>
        <Box>
        <Heading as="h1" size="4xl" fontFamily="Permanent Marker">Ivory</Heading>
        <Text fontSize="xl">RPG dice roller built for the web</Text>
        </Box>
      </Center>
    </Container>
  )
}

export default Home
