import * as React from "react";
import { NextPage } from "next";
import { Typography, Grid, Box, CardActionArea, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import styles from "./home.module.css";
import Link from "next/link";

const Home: NextPage = () => {

  const handleClick = async (value: string) => {
    console.log("clicked" , value);
  };

  return (
      <>
        <Grid className={styles.grid}>
          <Grid item xs={4}>
              <CardActionArea className={styles.card} onClick={() => handleClick("Knowledge Base")}>
                <CardContent>
                    <Box className={styles.iconContainer}>
                        <LibraryBooksIcon className={styles.icon}/>
                    </Box>
                    <Typography>Knowledge Base</Typography>
                </CardContent>
              </CardActionArea>
          </Grid>
          <Grid item xs={4}>
              <CardActionArea className={styles.card} onClick={() => handleClick("Tickets")}>
                <CardContent>
                    <Box className={styles.iconContainer}>
                        <SupportAgentIcon className={styles.icon} />
                    </Box>
                    <Typography>Tickets</Typography>
                </CardContent>
              </CardActionArea>
          </Grid>
          <Grid item xs={4}>
              <CardActionArea className={styles.card} onClick={() => handleClick("FAQ Insights")}>
                <CardContent>
                    <Box className={styles.iconContainer}>
                        <LightbulbOutlinedIcon  className={styles.icon}/>
                    </Box>
                    <Typography>FAQ Insights</Typography>
                </CardContent>
              </CardActionArea>
          </Grid>
        </Grid>
      </>
  );
};

export default Home;
