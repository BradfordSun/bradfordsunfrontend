import { Box, Container, Link, SpaceBetween } from '@cloudscape-design/components';
import React from 'react';

export function HomeContainer ({imgsrc, imgalt, appname, appdescription, appexample}) {
    return (
        <Container
      media={{
        content: (
          <img
            src={imgsrc}
            alt={imgalt}
          />
        ),
        position: "side",
        width: "33%"
      }}
    >
      <SpaceBetween direction="vertical" size="s">
        <SpaceBetween direction="vertical" size="xxs">
          <Box variant="h2">
            <Link fontSize="heading-m" href="#">
              {appname}
            </Link>
          </Box>
          <Box variant="small">{appdescription}</Box>
        </SpaceBetween>
        <Box variant="p">
          {appexample}
        </Box>
      </SpaceBetween>
    </Container>
    )
}