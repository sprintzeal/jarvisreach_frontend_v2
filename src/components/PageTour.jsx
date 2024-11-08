import React, { useState, useEffect } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import {
  useCheckDataQuery,
  useGetFolderViewQuery,
  useGetProfileFolderNameQuery,
  useGetProfileFoldersQuery,
  useGetStatusesQuery,
  useGetViewColumnsQuery,
  usePostUserTourMutation,
} from "../slices/customerSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router";
import { offset } from "highcharts";

const PageTour = ({ setActiveLead, setActiveTopSetting }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const navigate = useNavigate();
  const [userTourSuccess] = usePostUserTourMutation();
  const { data: userData, isLoading: userLoading } = useCheckDataQuery();
  const steps = [
    {
      target: ".tour-step-1",
      content:
        "Welcome to your dashboard! This is where you can create your first Folder.",
      disableBeacon: true,
      placement: "right",
      position: "right",
      styles: {
        tooltip: {
          marginTop: "-80px",
          marginLeft: "110px",
        },
      },
    },
    {
      target: ".tour-step-2",
      content:
        "Here you can see the overview of your folder Leads and its contents.",
      disableBeacon: true,
      placement: "right",
      styles: {
        tooltip: {
          marginTop: "-100px",
          marginLeft: "110px",
        },
      },
    },
    {
      target: ".tour-step-3",
      content: "Here you can see All of your Leads",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-70px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-4",
      content:
        "You can filter your leads by Tags, Status, Created, Updated, Sequence, and more.",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-80px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-5",
      content:
        "You can Paginate your leads by clicking on the pagination buttons.",
      disableBeacon: true,
      placement: "top",
      styles: {
        tooltip: {
          marginTop: "-230px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-6",
      content:
        "Here you can Manage your leads by Composing Email, Changing Status, Creating and Managing Sequences, and more.",
      disableBeacon: true,
      placement: "right",
      styles: {
        tooltip: {
          marginTop: "-90px",
          marginLeft: "30px",
        },
      },
    },
    {
      target: ".tour-step-7",
      content: "You can Verify any Email Address Here",
      disableBeacon: true,
      waitForSelector: true,
      placement: "right",
      styles: {
        tooltip: {
          marginTop: "-90px",
          marginLeft: "30px",
        },
      },
    },
    {
      target: ".tour-step-8",
      content: "You can Export your leads in CSV or Excel format",
      disableBeacon: true,
      placement: "right",
      styles: {
        tooltip: {
          marginTop: "-250px",
          marginLeft: "120px",
        },
      },
    },
    {
      target: ".tour-step-9",
      content: "Here you can see All your Plans and manage your Subscription",
      disableBeacon: true,
      placement: "left",
      styles: {
        spotlight: {
          marginTop: "-10px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-10",
      content: "If you need any help, you can always check our Help Section",
      disableBeacon: true,
      placement: "left",
      styles: {
        spotlight: {
          marginTop: "-10px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-11 ",
      content:
        "By clicking on your Profile, you can see your Account Settings, Subscription, and more.",
      disableBeacon: true,
      placement: "left",
      styles: {
        spotlight: {
          marginTop: "-10px",
          marginLeft: "0px",
        },
      },
    },
    {
      target: ".tour-step-12",
      content:
        "You can Check your plan details, and Renewal Date here. You can also Upgrade your Plan.",
      disableBeacon: true,
      waitForSelector: true,
      placement: "right",
      styles: {
        tooltip: {
          marginTop: "-250px",
          marginLeft: "120px",
        },
      },
    },
    {
      target: ".tour-step-13",
      content:
        "By Clicking on `Get it now` you easily download extension for your browser.",
      disableBeacon: true,
      waitForSelector: true,
      placement: "bottom",
      // screen position of the tooltip
      styles: {
        tooltip: {
          marginTop: "-100px",
          marginLeft: "30px",
        },
      },
    },
    {
      target: ".tour-step-14",
      content: "Don't forget to Rate us on Chrome Web Store.",
      disableBeacon: true,
      placement: "bottom",
      // screen position of the tooltip
      styles: {
        tooltip: {
          marginTop: "-100px",
          marginLeft: "30px",
        },
      },
    },
    {
      target: ".tour-step-15",
      content:
        "You can check our Help Section on how to use the extension on linkedin.",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-80px",
          marginLeft: "10px",
        },
      },
    },
    {
      target: ".tour-step-16",
      content:
        "You can check our Help Section if you need any help regarding credits and billing.",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-80px",
          marginLeft: "10px",
        },
      },
    },
    {
      target: ".tour-step-17",
      content: "You can check our Help Section for Bulk Enrichment.",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-80px",
          marginLeft: "10px",
        },
      },
    },
    // {
    //   target: ".tour-step-18",
    //   content: "You can check our Help Section about Automation",
    //   disableBeacon: true,
    // },
    {
      target: ".tour-step-19",
      content: "You can check our Help Section for Lead Generation",
      disableBeacon: true,
      styles: {
        tooltip: {
          marginTop: "-190px",
          marginLeft: "10px",
        },
      },
    },
  ];

  // Queries for fetching data
  const { data: getStatus, isLoading: statusLoading } = useGetStatusesQuery();
  const { data: views, isLoading: viewLoading } = useGetFolderViewQuery();
  const { data: getFolderName, isLoading: folderLoading } =
    useGetProfileFolderNameQuery();
  const fetchColumns = !viewLoading && views;
  const { data: columns, isLoading: columnLoading } = useGetViewColumnsQuery(
    fetchColumns ? { id: views?.result[0]?._id } : skipToken
  );
  const canFetchProfiles = !viewLoading && !columnLoading && views && columns;
  const { data: getProfiles, isFetching: isFetchingProfiles } =
    useGetProfileFoldersQuery(
      canFetchProfiles
        ? {
            id: getFolderName?.result[0]?._id,
            page: 1,
            limit: 5,
            viewId: views?.result[0]?._id,
          }
        : skipToken
    );

  // Manage tour state and activation
  useEffect(() => {
    if (
      statusLoading &&
      viewLoading &&
      folderLoading &&
      columnLoading &&
      !isFetchingProfiles
    ) {
      setRun(false);
    } else {
      setRun(true);
    }
  }, [statusLoading, viewLoading, folderLoading, columnLoading]);

  // useEffect(() => {
  //   if (location.pathname === "/folder") {
  //     setTimeout(() => {
  //       setRun(true);
  //     }, 500);
  //   } else if (location.pathname === "/home") {
  //     setStepIndex(11);
  //     setTimeout(() => {
  //       setRun(true);
  //     }, 500);
  //   }
  // }, [location.pathname, navigate, stepIndex]);

  return (
    <div>
      <Joyride
        steps={steps}
        run={userData?.result?.settings?.completedAppTour === false}
        stepIndex={stepIndex}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        showProgress={true}
        disableCloseOnEsc={true}
        locale={{
          skip: "Skip",
          next: "Next",
          close: "Close",
          last: "Finish",
        }}
        styles={{
          options: {
            zIndex: 2000,
            arrowColor: "none",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          // offset
          tooltip: {
            borderRadius: 4,
            padding: 10,
            marginBottom: 10,
          },
        }}
        callback={(data) => {
          const { action, index, status, type } = data;

          if ([EVENTS.TOUR_END, EVENTS.SKIP].includes(type)) {
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              setRun(false);
              setStepIndex(0);
              userTourSuccess().unwrap();
            }
          } else if (
            [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)
          ) {
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
          }

          if (action === "next" && index === 5) {
            setActiveLead(true);
          } else if (action === "next" && index === 8) {
            setActiveLead(false);
          }
          if (action === "close") {
            setRun(false);
          }
          if (index === 11 && action === "next") {
            navigate("/home");
            setTimeout(() => {
              setStepIndex(index + 1);
            }, 1000);
          }
        }}
      />
    </div>
  );
};

export default PageTour;
