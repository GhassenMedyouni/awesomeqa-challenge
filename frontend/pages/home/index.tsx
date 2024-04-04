import * as React from "react";
import { NextPage } from "next";
import { Typography, Grid, Box, CardActionArea } from "@mui/material";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import styles from "./home.module.css";
import {useRouter} from "next/router";

const Home: NextPage = () => {

  const router = useRouter()

  const handleClick = async (url: string) => {
    await router.push(url)
  };

  return (
      <>
        <Grid className={styles.grid}>
          <Grid item xs={4}>
              <CardActionArea disabled={true} className={styles.card}>
                  <Box className={styles.iconContainer}>
                      <LibraryBooksIcon className={styles.icon}/>
                  </Box>
                  <Typography>Knowledge Base</Typography>
              </CardActionArea>
          </Grid>
          <Grid item xs={4}>
              <CardActionArea className={styles.card} onClick={() => handleClick("/tickets")}>
                  <Box className={styles.iconContainer}>
                      <SupportAgentIcon className={styles.icon} />
                  </Box>
                  <Typography>Tickets</Typography>
              </CardActionArea>
          </Grid>
          <Grid item xs={4}>
              <CardActionArea disabled={true} className={styles.card} >
                  <Box className={styles.iconContainer}>
                      <LightbulbOutlinedIcon  className={styles.icon}/>
                  </Box>
                  <Typography>FAQ Insights</Typography>
              </CardActionArea>
          </Grid>
        </Grid>
      </>
  );
};

export default Home;
