import React, { useEffect, useState } from "react";
import MyEditorCompose from "../../../components/MyEditorCompose";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

import {
  useComposeEmailMutation,
  useGetSmptSettingsQuery,
} from "../../../slices/customerSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { FileCopy } from "@mui/icons-material";
const validationSchema = Yup.object({
  to: Yup.string().email("Invalid email").required("Required"),
  subject: Yup.string().required("Required"),
  fields: Yup.array().of(
    Yup.object({
      content: Yup.string().required("Required"),
    })
  ),
});
const ComposeEmail = ({ collapsed }) => {
  const navigate = useNavigate();
  const [fieldValue, setFieldValue] = useState();
  const [expanded, setExpanded] = useState("panel0");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isBetween600And650px = useMediaQuery(
    "(min-width:600px) and (max-width:668px)"
  );
  const is1270 = useMediaQuery("(max-width:1270px)");

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const {
    data: smtpData,
    error: smtpError,
    isLoading: smtpIsLoading,
  } = useGetSmptSettingsQuery();
  const [open, setOpen] = useState(
    smtpError?.data?.message === "Settings not found" ? true : false
  );

  useEffect(() => {
    if (smtpError?.data?.message === "Settings not found") {
      setOpen(true);
    }
  }, [smtpError]);

  const [
    composeEmail,
    {
      isLoading: composeEmailIsLoading,
      error: composeEmailError,
      isSuccess: composeEmailIsSuccess,
    },
  ] = useComposeEmailMutation();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      for (const field of values.fields) {
        // check if field.content has img tag then remove from content and append separately to formData as attachments
        // const imgTags = field.content.match(/<img[^>]+>/g);
        // if (imgTags) {
        //   imgTags.forEach(async (imgTag) => {
        //     const src = imgTag.match(/src="([^"]*)"/)[1];
        //     const fileName = src.split("/").pop();
        //     const blob = await fetch(src).then((res) => res.blob());
        //     const file = new File([blob], fileName, { type: blob.type });
        //     values.files.push(file);
        //     field.content = field.content.replace(imgTag, "");
        //   });
        // }

        const emptyTag = field.content.replace(/<[^>]*>/g, "").trim();
        console.log("emptyTag", emptyTag);

        if (emptyTag === "") {
          toast.error("Content is required");
          return;
        }

        const formData = new FormData();
        formData.append("to[]", values.to);
        formData.append("subject", values.subject);
        formData.append("body", field.content);

        // Append all files to FormData
        values.files.forEach((file) => {
          formData.append("attachments", file);
        });

        await composeEmail({
          body: formData,
        }).unwrap();
      }
      if (composeEmailIsSuccess) {
        values.fields.forEach((field, index) => {
          setFieldValue(`fields.${index}.content`, ""); // Reset field content using setFieldValue
        });
      }

      toast.success("Emails sent successfully");
      setFieldValue("");
      resetForm();
      setExpanded(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // console.log(fieldValue);
  return (
    <div>
      <div className="content-page">
        <div
          className="content"
          style={{
            marginBottom: isSmallScreen || is1270 ? "150px" : "0px",
          }}
        >
          {/* <!-- Start Content--> */}
          <div className="container-fluid">
            {/* <!-- start page title --> */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">Javirs Reach</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">Email</a>
                      </li>
                      <li className="breadcrumb-item active">Email Compose</li>
                    </ol>
                  </div>
                  <h4 className="page-title">Email Compose</h4>
                </div>
              </div>
            </div>
            {/* <!-- end page title -->  */}

            {/* <!-- Right Sidebar --> */}
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="card"
                  // style={{
                  //   maxWidth: isSmallScreen ? "100%" : "1600px",
                  // }}
                >
                  <div className="card-body">
                    <div className="mt-4">
                      <Formik
                        initialValues={{
                          to: "",
                          subject: "",
                          fields: [{ content: "" }],
                          files: [],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ values, setFieldValue, handleSubmit }) => (
                          <Form onSubmit={handleSubmit}>
                            <div className="mb-3 px-2">
                              <Field
                                name="to"
                                type="email"
                                className="form-control"
                                placeholder="To"
                              />
                              <ErrorMessage
                                name="to"
                                component="div"
                                style={{
                                  color: "#ff000d",
                                  fontSize: "12px",
                                  marginTop: "5px",
                                }}
                              />
                            </div>

                            <div className="mb-3 px-2">
                              <Field
                                name="subject"
                                type="text"
                                className="form-control"
                                placeholder="Subject"
                              />
                              <ErrorMessage
                                name="subject"
                                component="div"
                                style={{
                                  color: "#ff000d",
                                  fontSize: "12px",
                                  marginTop: "5px",
                                }}
                              />
                            </div>

                            <FieldArray name="fields">
                              {({ push, remove }) => (
                                <div>
                                  {values.fields.map((field, index) => (
                                    <Accordion
                                      key={index}
                                      expanded={true}
                                      onChange={handleAccordionChange(
                                        `panel${index}`
                                      )}
                                      sx={{
                                        boxShadow: "none",
                                        padding: isSmallScreen
                                          ? "0px 0px 120px 0px"
                                          : "0px 0px 40px 0px",
                                      }}
                                    >
                                      <AccordionSummary
                                        aria-controls={`panel${index}bh-content`}
                                        id={`panel${index}bh-header`}
                                        sx={{
                                          padding: "0px",
                                          marginBottom: "-30px",
                                        }}
                                      />
                                      <AccordionDetails>
                                        <Field
                                          name={`fields.${index}.content`}
                                          component={MyEditorCompose}
                                          key={
                                            values.fields[index].content
                                              ? `editor-${index}`
                                              : `editor-reset-${index}`
                                          } // Use dynamic key
                                        />
                                        <ErrorMessage
                                          name={`fields.${index}.content`}
                                          component="div"
                                          style={{
                                            color: "#ff000d",
                                            fontSize: "12px",
                                            marginTop: "5px",
                                          }}
                                        />
                                      </AccordionDetails>
                                    </Accordion>
                                  ))}
                                </div>
                              )}
                            </FieldArray>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                justifyContent:
                                  values.files.length === 0 ? "end" : "start",
                                marginTop: isBetween600And650px
                                  ? "50px"
                                  : "0px",
                                alignItems:
                                  values.files.length === 0 ? "end" : "start",
                                width: "100%",
                                paddingRight: "15px",
                                paddingTop: "10px",
                                marginLeft: "20px",
                              }}
                            >
                              {values.files.length === 0 && (
                                <>
                                  <div
                                    className="dropify-wrapper drop-height"
                                    style={{
                                      padding: "4px",
                                      marginTop: isSmallScreen
                                        ? "220px"
                                        : "0px",
                                    }}
                                  >
                                    <div
                                      className="dropify-message"
                                      onClick={() => {
                                        document
                                          .querySelector('input[type="file"]')
                                          .click();
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        const droppedFiles = Array.from(
                                          e.dataTransfer.files
                                        );

                                        setFieldValue("files", [
                                          ...values.files,
                                          ...droppedFiles.filter((newFile) => {
                                            if (
                                              values.files.some(
                                                (file) =>
                                                  file.name === newFile.name
                                              )
                                            ) {
                                              toast.error(
                                                "File already exists"
                                              );
                                              return false;
                                            }
                                            return !values.files.some(
                                              (file) =>
                                                file.name === newFile.name
                                            );
                                          }),
                                        ]);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <span className="file-icon">
                                        <p
                                          style={{
                                            fontSize: isSmallScreen
                                              ? "10px"
                                              : "14px",
                                          }}
                                        >
                                          Drag and drop a file here or click{" "}
                                          <br /> to add a file
                                        </p>
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                              <input
                                type="file"
                                multiple
                                onChange={(event) => {
                                  const newFiles = Array.from(
                                    event.target.files
                                  );
                                  setFieldValue("files", [
                                    ...values.files,
                                    ...newFiles.filter((newFile) => {
                                      if (
                                        values.files.some(
                                          (file) => file.name === newFile.name
                                        )
                                      ) {
                                        toast.error("File already exists", {
                                          position: "bottom-right",
                                          style: { zIndex: 10000000000 },
                                          duration: 5000,
                                        });
                                        return false;
                                      }
                                      return !values.files.some(
                                        (file) => file.name === newFile.name
                                      );
                                    }),
                                  ]);
                                }}
                                style={{ display: "none" }}
                              />
                              {values.files.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  {values.files.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        position: "relative",
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {file.type.startsWith("image/") ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: "150px",
                                            height: "100px",
                                            border: "1px solid #ccc",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{
                                              width: "150px",
                                              height: "100px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "row",
                                            width: "150px",
                                            height: "100px",
                                            border: "1px solid #ccc",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <FileCopy
                                            style={{
                                              marginRight: "5px",
                                              fontSize: "34px",
                                            }}
                                          />
                                          <p
                                            style={{
                                              fontSize: "14px",
                                              margin: 0,
                                            }}
                                            title={file.name}
                                          >
                                            {file.name.length > 16
                                              ? `${file.name.substring(
                                                  0,
                                                  16
                                                )}...`
                                              : file.name}
                                          </p>
                                        </div>
                                      )}
                                      <IconButton
                                        onClick={() => {
                                          const updatedFiles =
                                            values.files.filter(
                                              (_, i) => i !== index
                                            );
                                          setFieldValue("files", updatedFiles);
                                        }}
                                        style={{
                                          position: "absolute",
                                          top: "-6%",
                                          right: "-6%",
                                        }}
                                      >
                                        <DeleteIcon sx={{ color: "#ff000d" }} />
                                      </IconButton>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {values.files.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "end",
                                  justifyContent: "end",
                                }}
                              >
                                <button
                                  className="btn btn-warning waves-effect waves-light mt-2 mb-2 brn-add-remove"
                                  onClick={() => {
                                    document
                                      .querySelector('input[type="file"]')
                                      .click();
                                  }}
                                >
                                  <span>Add More +</span>
                                </button>
                              </div>
                            )}

                            <div className="text-end mt-3">
                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                endIcon={<SendIcon />}
                                disabled={composeEmailIsLoading}
                              >
                                {composeEmailIsLoading ? "Sending..." : "Send"}
                              </Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    {/* <!-- end card--> */}

                    {/* <!-- end inbox-rightbar--> */}

                    <div className="clearfix"></div>
                  </div>
                </div>
              </div>
              {/* <!-- end Col --> */}
            </div>
            {/* <!-- End row --> */}
          </div>
          {/* <!-- container --> */}
        </div>
        {/* <!-- content --> */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"No SMPT Settings?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              No Smpt settings found in the database, please add one.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate("/smtp")} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        {/* <!-- Footer Start --> */}
        <footer
          className="footer"
          style={
            collapsed
              ? { left: "50px", transition: "all 0.3s ease", zIndex: "999" }
              : { left: "240px", transition: "all 0.3s ease", zIndex: "999" }
          }
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                2024 © All Rights Reserved By Jarvis Reach
              </div>
              <div className="col-md-6">
                <div className="text-md-end footer-links d-none d-sm-block">
                  <a
                    href={`${
                      import.meta.env.VITE_JARVIS_MARKETING_HELP
                    }/about-us`}
                    target="_blank"
                  >
                    About Us
                  </a>
                  <a
                    href={`${
                      import.meta.env.VITE_JARVIS_MARKETING_HELP
                    }/help-center`}
                    target="_blank"
                  >
                    Help
                  </a>{" "}
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* <!-- end Footer --> */}
      </div>
    </div>
  );
};

export default ComposeEmail;
