import * as React from "react";
import {
  Button,
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  MenuItem,
  styled,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import axios from "axios";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { makeStyles } from "@mui/styles";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";

const Input = styled("input")({
  display: "none",
});

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const useStyles = makeStyles({
  textField: {
    "& p": {
      color: "red",
    },
  },
});

const Help = () => {
  const classes = useStyles();

  const [attachmentFile, setAttachmentFile] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [discordID, setDiscordID] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [priority, setPriority] = React.useState("1");
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarMessage, setSnackBarMessage] = React.useState("");
  const [snackbarType, setSnackbarType] = React.useState<string>("error");
  const [emailValidationText, setEmailValidationText] = React.useState("");

  const replyEmailForm = (id: any, discordId: any) => {
    return (
      "" +
      `<h2>Your support ticket ${id} has been submitted.</h2>` +
      "<br />" +
      `<p>Hi ${discordID},</p>` +
      "<br />" +
      "<p>The Support Team of Crypto Legions has received your ticket. We’ll get back to you within 24 hours if your request relates to a bug/issue inside the game programming.</p>" +
      "<br />" +
      "<p>If your request is not directly related to a bug/issue we should fix, for example, a proposal or promotional message, then your ticket might be closed without a reply from us.</p>" +
      '<p>In some cases, your ticket might also be closed without a reply from us if the answer to your question can be easily found by reading the game instructions in our whitepaper: <a href="https://docs.cryptolegions.app" target="_blank">https://docs.cryptolegions.app</a></p>' +
      "<p>Please understand we need to give priority to players who have issues related to the game coding to be fixed by our developers.</p>" +
      "<br />" +
      '<p style="font-weight: bold">Useful links:</p>' +
      '<p>- Simple video instructions on how to play Crypto Legions: <a href="https://docs.cryptolegions.app/how-to-get-started" target="_blank">https://docs.cryptolegions.app/how-to-get-started</a></p>' +
      '<p>- If you are an influencer, please click on "I am an influencer" on our website: <a href="https://cryptolegions.app" target="_blank">https://cryptolegions.app</a></p>' +
      '<p>- If you want to be part of the beta-test of the game, apply to test here: <a href="https://cryptolegions.app" target="_blank">https://cryptolegions.app</a></p>' +
      '<p>- If you are already approved as a Tester, and you want to report a bug as part of our Testing Contest, please report your bug in the #report-bug channel on our Discord: <a href="https://discord.gg/6ddCCMAnbM" target="_blank">https://discord.gg/6ddCCMAnbM</a></p>' +
      "<br />" +
      '<p style="font-weight: bold">Make sure to connect with us on social media:</p>' +
      '<p>- Discord: <a href="https://cryptolegions.app/d" target="_blank">https://cryptolegions.app/d</a></p>' +
      '<p>- Telegram: <a href="https://cryptolegions.app/t" target="_blank">https://cryptolegions.app/t</a></p>' +
      '<p>- Twitter: <a href="https://cryptolegions.app/tw" target="_blank">https://cryptolegions.app/tw</a></p>' +
      '<p>- Youtube: <a href="https://cryptolegions.app/y" target="_blank">https://cryptolegions.app/y</a></p>' +
      '<p>- Medium: <a href="https://cryptolegions.app/m" target="_blank">https://cryptolegions.app/m</a></p>' +
      "<br />" +
      "<p>Happy travels to Nicah to play Crypto Legions!</p>" +
      "<br />" +
      "<p>All the best,</p>" +
      "<p>Crypto Legions Support Team</p>" +
      '<p><a href="https://cryptolegions.app" target="_blank">https://cryptolegions.app</a></p>' +
      "<p>support@cryptolegions.app</p>"
    );
  };

  const createTicket = async (event: any) => {
    event.preventDefault();
    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setEmailValidationText("invalidation email");
      return;
    }

    setEmailValidationText("");

    var API_KEY = process.env.REACT_APP_HELP_API_KEY;
    var FD_ENDPOINT = "cryptolegions";
    var PATH = "/api/v2/tickets";
    var auth = "Basic " + new Buffer(API_KEY + ":" + "X").toString("base64");
    var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH;

    var formInfo = new FormData();
    formInfo.append("email", email);
    formInfo.append("subject", subject);
    formInfo.append("description", description.replaceAll("\n", "<br/>"));
    formInfo.append("status", "2");
    formInfo.append("priority", priority);
    formInfo.append("tags[]", "WEBSITE");
    formInfo.append("custom_fields[cf_discord]", discordID);

    if (attachmentFile) {
      formInfo.append("attachments[]", attachmentFile);
    }

    var headers = {
      Authorization: auth,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post(URL, formInfo, {
        headers: headers,
      })
      .then((res) => {
        axios
          .post(
            URL + "/" + res.data.id + "/reply",
            {
              body: replyEmailForm(
                res.data.id,
                res.data.custom_fields.cf_discord
              ),
            },
            {
              headers: {
                Authorization: auth,
                "Content-Type": "application/json",
              },
            }
          )
          .then((r) => {})
          .catch((err) => {});
        if (res.status === 201) {
          setSnackbarType("success");
          setSnackBarMessage("Created ticket successfully!");
          setOpenSnackBar(true);
        }
        setEmail("");
        setSubject("");
        setDescription("");
        setDiscordID("");
        setAttachmentFile(null);
        setPriority("1");
      })
      .catch((err) => {});
  };

  const setFile = (e: any) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size / 1024 / 1024 > 15) {
        setSnackBarMessage("Attachment file must be smaller than 15 MB!");
        setSnackbarType("error");
        setOpenSnackBar(true);
      } else {
        setAttachmentFile(e.target.files[0]);
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Card
        sx={{
          background: "#16161699",
          p: 2,
          my: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            borderBottom: "1px solid #fff",
            paddingBottom: 2,
          }}
        >
          <LanguageTranslate translateKey="helpText" />
        </Typography>
        <Box sx={{ p: 4 }}>
          <form
            onSubmit={(event: any) => {
              createTicket(event);
            }}
          >
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
              <Grid item md={6}>
                <TextField
                  label={<LanguageTranslate translateKey="email" />}
                  placeholder={LanguageTranslate({ translateKey: "yourEmail" })}
                  onChange={(e: any) => setEmail(e.target.value)}
                  name="email"
                  value={email}
                  sx={{ width: "100%" }}
                  type="email"
                  id="outlined-required"
                  required
                  helperText={emailValidationText}
                  className={classes.textField}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  id="outlined-basic"
                  label={LanguageTranslate({ translateKey: "discordId" })}
                  placeholder={LanguageTranslate({
                    translateKey: "yourDiscord",
                  })}
                  value={discordID}
                  sx={{ width: "100%" }}
                  onChange={(e) => setDiscordID(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
              <Grid item xs={12}>
                <TextField
                  label={LanguageTranslate({ translateKey: "title" })}
                  placeholder={LanguageTranslate({
                    translateKey: "titleIssue",
                  })}
                  onChange={(e: any) => setSubject(e.target.value)}
                  name="subject"
                  value={subject}
                  sx={{ width: "100%" }}
                  id="outlined-required"
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
              <Grid item xs={12}>
                <TextField
                  label={LanguageTranslate({ translateKey: "description" })}
                  placeholder={LanguageTranslate({
                    translateKey: "descriptionText",
                  })}
                  onChange={(e: any) => setDescription(e.target.value)}
                  name="description"
                  value={description}
                  sx={{ width: "100%" }}
                  id="outlined-required"
                  required
                  multiline
                  rows={7}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
              <Grid item md={6} sx={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => setFile(e)}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <AttachFileRoundedIcon />
                  </IconButton>
                  {attachmentFile
                    ? attachmentFile["name"] +
                      " / " +
                      (attachmentFile["size"] / 1024 / 1024).toFixed(3) +
                      "MB"
                    : LanguageTranslate({ translateKey: "attachmentFile" })}
                </label>
              </Grid>
              <Grid item md={6}>
                <TextField
                  id="outlined-select"
                  select
                  label={LanguageTranslate({ translateKey: "priority" })}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  helperText={LanguageTranslate({
                    translateKey: "selectPriority",
                  })}
                  sx={{ width: "100%" }}
                >
                  <MenuItem value={"1"}>
                    {LanguageTranslate({ translateKey: "low" })}
                  </MenuItem>
                  <MenuItem value={"2"}>
                    {LanguageTranslate({ translateKey: "medium" })}
                  </MenuItem>
                  <MenuItem value={"3"}>
                    {LanguageTranslate({ translateKey: "high" })}
                  </MenuItem>
                  <MenuItem value={"4"}>
                    {LanguageTranslate({ translateKey: "urgent" })}
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex" }}>
              <Button
                sx={{ marginLeft: "auto" }}
                color="primary"
                variant="contained"
                type="submit"
              >
                {LanguageTranslate({ translateKey: "createTicket" })}
              </Button>
            </Box>
          </form>
        </Box>
      </Card>
      <Snackbar
        open={openSnackBar}
        TransitionComponent={TransitionUp}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={TransitionUp ? TransitionUp.name : ""}
      >
        {snackbarType === "success" ? (
          <Alert
            onClose={() => setOpenSnackBar(false)}
            variant="filled"
            severity={"success"}
            sx={{ width: "100%" }}
          >
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenSnackBar(false)}
            >
              {snackBarMessage}
            </Box>
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpenSnackBar(false)}
            variant="filled"
            severity={"error"}
            sx={{ width: "100%" }}
          >
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => setOpenSnackBar(false)}
            >
              {snackBarMessage}
            </Box>
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default Help;
