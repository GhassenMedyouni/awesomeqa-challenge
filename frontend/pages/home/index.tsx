import * as React from "react";
import { NextPage } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import styles from "./home.module.css";
import Link from "next/link";
import CardContent from "@mui/material/CardContent";

const Home: NextPage = () => {

  const handleClick = async () => {
    console.log("clicked");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15}}>
        <Grid className={styles.grid}>
            <Card className={styles.card}>
              <CardContent>
                <LibraryBooksIcon className={styles.icon}/>
                <p>Knowledge Base</p>
              </CardContent>
            </Card>
          <Card className={styles.card}>
            <CardContent>
              <SupportAgentIcon className={styles.icon}/>
              <p>Tickets</p>
            </CardContent>
          </Card>
          <Card className={styles.card}>
            <CardContent>
              <LightbulbIcon className={styles.icon} />
              <p>FAQ Insights</p>
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
