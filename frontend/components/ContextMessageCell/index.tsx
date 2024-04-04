import React, {useState} from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ContextMessagesCell = ({ value }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenMessage = (messageId: string) => {
        const msg_url = `https://discord.com/channels/${process.env.DISCORD_SERVER_ID}/${process.env.DISCORD_CHANNEL_ID}/${messageId}`;
        window.open(msg_url, '_blank');
        alert("The msg_url is: " + msg_url);
    }

    return (
        <>
            <Button variant="contained" onClick={handleOpenMenu}
                    endIcon={anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
            >
                View Context
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                {value.map((contextMsgId, index) => (
                    <MenuItem key={index} onClick={() => handleOpenMessage(contextMsgId)}>
                        Message {index + 1}
                        <OpenInNewIcon style={{ marginLeft: 4 }}/>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ContextMessagesCell;
