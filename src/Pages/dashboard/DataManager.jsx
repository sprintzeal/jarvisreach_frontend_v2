import {
  Article,
  Ballot,
  Book,
  ChevronLeft,
  ChevronRight,
  Label,
  LabelImportant,
  Notes,
  Phone,
  PriorityHighOutlined,
  School,
  Search,
  Verified,
  WorkOutline,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { skipToken } from "@reduxjs/toolkit/query";
import * as XLSX from "xlsx";
import DateRange from "../../components/DateRange";
import MyEditorDashboard from "../../components/MyEditorDashboard";

import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Modal,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";

import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { BiChevronDown } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelopeOpenText,
  FaEyeSlash,
  FaGripHorizontal,
  FaMailBulk,
  FaMapMarkerAlt,
  FaMinus,
  FaMinusCircle,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import {
  FaAddressCard,
  FaArrowUpWideShort,
  FaChartSimple,
  FaCircleRight,
  FaCircleUser,
  FaCopy,
  FaDownload,
  FaEllipsisVertical,
  FaEnvelope,
  FaEnvelopeCircleCheck,
  FaFileLines,
  FaFilter,
  FaLinkedin,
  FaMobileScreen,
  FaPlus,
  FaRetweet,
  FaRightFromBracket,
  FaSquarePollHorizontal,
  FaTag,
  FaTrash,
  FaUserCheck,
  FaUserGroup,
} from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Scrollbar } from "../../components/Scrollbar";
import SortColumns from "../../components/SortColumns";
import {
  useDeleteImportMutation,
  useGetAdminProfileQuery,
  useDeleteByFilesMutation,
  useGetAllAddedSummariesQuery
} from "../../slices/adminSlice";
import {
  useAddNoteAndTagMutation,
  useAssignTemplateMutation,
  useComposeEmailMutation,
  useCreateSequenceMutation,
  useDeleteLeadMutation,
  useGetAllTagsQuery,
  useGetExportSettingsQuery,
  useGetFolderViewQuery,
  useGetProfileFolderNameQuery,
  useGetSequenceTemplatesQuery,
  useGetStatusesQuery,
  useGetViewColumnsQuery,
  useImportTemplateMutation,
  useMoveToFolderMutation,
  usePostCreateExportMutation,
  useProfileMultipleStatusMutation,
  useProfileTagsAndUntagsMutation,
  useUpdateColumnMutation,
  useUpdateProfileMutation,
  useUpdateStatusMutation,
  useUpdateTagMutation,
} from "../../slices/customerSlice";
import { daysAgo } from "../../utils/timeAgo";

const DataManager = ({ collapsed, folderId }) => {
  const windowWidth = window.innerWidth;

  const getGridTemplateColumns = () => {
    if (windowWidth > 1000) {
      return "repeat(6, 1fr)";
    } else if (windowWidth > 768 && windowWidth < 1000) {
      return "repeat(3, 1fr)";
    } else if (windowWidth > 480 && windowWidth < 768) {
      return "repeat(2, 1fr)";
    } else {
      return "1fr";
    }
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: getGridTemplateColumns(),
  };
  const [editorValue, setEditorValue] = useState("");
  const [importEmail, setImportEmail] = useState("");
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [sequences, setSequences] = useState();
  const [activeDropdown, setActiveDropdown] = useState("");
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [imports] = useImportTemplateMutation();
  const [uploadImportFileError, setUploadImportFileError] = useState(false);
  const [statusCheckedId, setStatusCheckedId] = useState([]);
  const [activeDropdownTable, setActiveDropdownTable] = useState("");
  const [activeDropdownMore, setActiveDropdownMore] = useState(false);
  const [activeDrawer, setSettingsActiveDrawer] = useState(false);
  const [openEditPopOver, setOpenEditPopOver] = useState(false);
  const [openEditPopOverDrawer, setOpenEditPopOverDrawer] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [sendTags, setSendTags] = useState([]);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [addTag, setAddTag] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [search, setSearch] = useState("");
  const [activeDrawers, setActiveDrawers] = useState(false);
  const [query, setQuery] = useState("");
  const { folders } = useSelector((state) => state.folder);
  const [addNoteQuery] = useAddNoteAndTagMutation();
  const [note, setNote] = useState("");
  const [activeDropdownExport, setActiveDropdownExport] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUpdated, setAnchorElUpdated] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [anchorElId, setAnchorElId] = useState(null);
  const open = Boolean(anchorEl);
  const isOpen = Boolean(anchorElId);
  const id = (isOpen ? isOpen : open) ? "simple-popover" : undefined;
  const [tagId, setTagId] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sort, setSort] = useState("");
  const [popOverEl, setPopOverEl] = useState(null);
  const [tagChecked, setTagChecked] = useState({});
  const [inputField, setInputField] = useState([{ email: "" }]);
  const [folderIds, setFolderIds] = useState("");
  const [activeDropdownLeadStatus, setActiveDropdownLeadStatus] = useState("");
  const [anchorElLeadStatus, setAnchorElLeadStatus] = useState(null);
  const [openLeadStatus, setOpenLeadStatus] = useState(false);
  const [leadStatus, setLeadStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [deleteImport, { isLoading: deleteImportLoading }] =
    useDeleteImportMutation();
    const [deleteByFiles] = useDeleteByFilesMutation();
  const handleEditFolderName = () => {
    setOpenEditPopOver(true);
  };
  const [openEditNote, setOpenEditNote] = useState(false);
  const [anchorEditNoteEl, setAnchorEditNoteEl] = useState(null);
  const [openEditNoteInput, setOpenEditNoteInput] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editNoteId, setEditNoteId] = useState("");
  const [editNoteInputEl, setEditNoteInputEl] = useState(null);
  const [notePosition, setNotePosition] = useState({ top: 0, left: 0 });
  const [openToolTipId, setOpenToolTipId] = useState(null);
  const [openToolTipColumn, setOpenToolTipColumn] = useState("");
  const [drawerProfileIdToolTip, setDrawerProfileIdToolTip] = useState({});

  const handleCloseEditNotePopover = () => {
    setOpenEditNoteInput(false);
  };
  const handleCloseEditNote = () => {
    setOpenEditNote(false);
  };
  const [updateStatus] = useUpdateStatusMutation();
  const [selectedValue, setSelectedValue] = useState("");
  const [openMoveToFolder, setOpenMoveToFolder] = useState(false);
  const [moveFolderEl, setMoveFolderEl] = useState(null);
  const [openMoveToTemplate, setOpenMoveToTemplate] = useState(false);
  const [templateEl, setTemplateEl] = useState(null);
  const [searchFolder, setSearchFolder] = useState("");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [tagPopover, setTagPopover] = useState(false);
  const [tagPopoverEl, setTagPopoverEl] = useState(null);
  const [confirmOpenLead, setConfirmOpenLead] = useState(false);
  const [confirmOpenLeadNote, setConfirmOpenLeadNote] = useState(false);
  const [untag, setUntag] = useState(false);
  const [sortField, setSortField] = useState([]);
  const [editTemplateEmail, setEditTemplateEmail] = useState("");
  const [editTemplateBody, setEditTemplateBody] = useState([]);
  const [editTemplateName, setEditTemplateName] = useState("");
  const [editTemplateSubject, setEditTemplateSubject] = useState("");
  const [editTemplateId, setEditTemplateId] = useState("");
  const [editTemplateLeadId, setEditTemplateLeadId] = useState("");
  const [importsLoading, setImportsLoading] = useState(false);
  const [isImportsComplete, setIsImportsComplete] = useState(false);
  const handleConfirmCloseLead = () => {
    setConfirmOpenLead(false);
  };
  const [openTemplate, setOpenTemplate] = useState(false);
  const handleCloseTemplate = () => {
    setOpenTemplate(false);
  };
  const [columnData, setColumnData] = useState([]);

  const [createSequence] = useCreateSequenceMutation();
  const [openImportDrawer, setOpenImportDrawer] = useState(false);
  const [openImportDeleted, setOpenImportDeleted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [profileTagAndU] = useProfileTagsAndUntagsMutation();
  const [profilemultipleTag] = useProfileMultipleStatusMutation();
  const [selectedLeadStatusId, setSelectedLeadStatusId] = useState("");

  const handleConfirmCloseLeadNote = () => {
    setConfirmOpenLeadNote(false);
  };
  const [deleteLead] = useDeleteLeadMutation();
  const handleFileSelection = (event) => {
    const { value, checked } = event.target; 
    setSelectedFiles((prevSelectedFiles) => {
      if (checked) {
        return [...prevSelectedFiles, { filename: value }];
      } else {
        return prevSelectedFiles.filter((file) => file.filename !== value);
      }
    });
  };
  const handleCombinedClick = () => {
    handleDropdownToggle("createdBy");
  };
  
  const handleDeleteFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select files to delete.");
      return;
    }
    console.log("Selected files:", selectedFiles);
    const filenames = selectedFiles.map(file => file.filename); 
  
    try {
      const res = await deleteByFiles({ filenames }).unwrap();
      toast.success(res?.message || "Files deleted successfully");
      setSelectedFiles([]);
    } catch (error) {
       toast.error(error?.message || "Error deleting files");
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  
  const handleConfirmDelete = async () => {
    
    try {
      const body = {
        folderId: folderIds,
        leadIds: selectedProfiles,
      };
      const res = await deleteLead({
        body: body,
      }).unwrap();

      setConfirmOpenLead(false);
      toast.success(res.message);
      setSelectedProfiles([]);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
  const handleConfirmDeleteNote = async () => {
    try {
      await deleteLead({
        id: selectedProfiles[0]._id,
      }).unwrap();

      setConfirmOpenLead(false);
      // toast.success("Lead deleted successfully");
      toast.success("Note deleted successfully");
      setSelectedProfiles([]);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  const handleChange = async (event, profile) => {
    const value = event.target.value;
    setSelectedValue(value);
    const isChecked = event?._id ? true : event.target.checked;

    setSelectedLeadStatusId((prevState) => ({
      ...prevState,
      [profile?._id ? profile?._id : profile]: isChecked ? value : null,
    }));
    try {
      await updateStatus({
        body: {
          leadId: profile._id,
          statusId: event?._id ? event?._id : event.target.value,
        },
      })
        .unwrap()
        .then((res) => {
          toast.success(res.message);
          refetchStatus();
        })
        .catch((error) => {
          console.error("Error updating:", error);
          toast.error(error.data.message);
          setSelectedValue("");
          setSelectedLeadStatusId([]);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEditClick = (e, note) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setNotePosition({ top: rect.top, left: rect.left });
    setEditNoteInputEl(e.currentTarget);
    setOpenEditNoteInput(true);
    setOpenEditNote(false);
  };

  const handleSaveClick = async () => {
    // Save the edited note
    try {
      await deleteLead({
        id: selectedProfiles[0]._id,
      }).unwrap();

      handleCloseEditNotePopover();
      toast.success("Note Edited successfully");
      setSelectedProfiles([]);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  const postEditEmail = async () => {
    // Save the edited note
    try {
      await deleteLead({
        id: selectedProfiles[0]._id,
      }).unwrap();

      handleCloseEditNotePopover();
      toast.success("Email Edited successfully");
      setSelectedProfiles([]);
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };

  const handleEditNoteClick = (event, note, id) => {
    setEditNoteId(id);
    try {
      setEditNote("");
      toast.success("Note updated successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error.data.message);
    }
  };
 
  const radioOptions = [
    { name: "Added", value: "added", color: "" },
    { name: "Contacted", value: "contacted", color: "form-check-success" },
    { name: "Connected", value: "connected", color: "form-check-info" },
    { name: "In Progress", value: "in_progress", color: "" },
    { name: "Won", value: "won", color: "form-check-warning" },
    {
      name: "Unqualified",
      value: "unqualified",
      color: "form-check-primary",
    },
    { name: "Lost", value: "lost", color: "form-check-pink" },
  ];
  const [tagIds, setTagIds] = useState("");
  const [updateTag, { isLoading: updateTagLoading }] = useUpdateTagMutation();
  const [assignTemplate] = useAssignTemplateMutation();
  const handleAddNote = async (profile) => {
    try {
      await updateTag({
        id: profile?._id,
        body: {
          notes: [...profile?.notes, note],
        },
      }).unwrap();
      toast.success("Note added successfully");
      setNote("");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(error.data.message);
    }
  };
  const [fieldValuePairs, setFieldValuePairs] = useState([]);
  const [inputValue, setInputValue] = useState("");
 
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
      if (!fieldValuePairs.includes(inputValue.trim())) {
        setFieldValuePairs([...fieldValuePairs, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const handleDelete = (indexToRemove) => {
    setFieldValuePairs(
      fieldValuePairs.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const emails = getProfiles?.result?.allLeads
      ?.find((profile) => profile._id === editTemplateLeadId)
      ?.emails?.map((field, index) => {
        return {
          email: field,
        };
      });
    setFieldValuePairs(emails);
  }, [editTemplateLeadId]);

  const handleCreateTags = async (profile) => {
    try {
      await addNoteQuery({
        body: {
          name: editName,
          color: editColor,
        },
      })
        .unwrap()
        .then((res) => {
          toast.success("Tag added successfully");

          handleUpdateTag(
            profile._id,
            res.newTag ? [...profile.tags, res.newTag] : profile.tags
          );
        });
      handleDropdownToggle("");
    } catch (error) {
      console.error("Error adding tag:", error);
      toast.error(error.data.message);
    }
  };

  const allFields = [
    "name",
    "firstName",
    "lastName",
    "skills",
    "educations",
    "profileUrl",
    "emails",
    "phones",
    "tags",
    "notes",
    "status",
    "country",
    "state",
    "city",
    "createdAt",
    "updatedAt",
  ];
  const [postExport] = usePostCreateExportMutation();

  const [initialValues, setInitialValues] = useState({
    fileFormat: "csv",
    includeResultsWithOutEmails: true,
    includeResultsWithOutPhones: true,
    directEmails: true,
    directPhones: true,
    workEmails: true,
    workPhones: true,
    customColumns: [],
    fieldsTemplate: "allFields",
  });
  const validationSchema = Yup.object().shape({
    fileFormat: Yup.string().required("File format is required"),
    includeResultsWithOutEmails: Yup.boolean(),
    includeResultsWithOutPhones: Yup.boolean(),
    directEmails: Yup.boolean(),
    directPhones: Yup.boolean(),
    workEmails: Yup.boolean(),
    workPhones: Yup.boolean(),
    customColumns: Yup.array(),
  });

  const handleSubmitExport = async (values) => {
    try {
      const res = await postExport({
        body: {
          ...values,
        },
      }).unwrap();

      if (res.success === true) {
        window.open(res.newExport.resultFile, "_blank");
      }
      toast.success("Exporting contacts Successfully");
      setActiveDropdown("");
    } catch (error) {
      console.error("Error exporting contacts:", error);
      toast.error(error.data.message);
    }
  };

  const [showDrawerTab, setShowDrawerTab] = useState("Profile");
  const [accordion, setAccordion] = useState({
    accordion1: true,
    accordion2: false,
    accordion3: false,
    accordion4: false,
    accordion5: false,
    accordion6: false,
    accordion7: false,
    accordion8: false,
  });
  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
    setActiveDropdownTable(activeDropdownTable === dropdown ? "" : dropdown);
  };
  const [importValue, setImportValue] = useState("");
  const [allContant, setAllContant] = useState(true);
  const [recentlyCreated, setRecentlyCreated] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const [newView, setNewView] = useState(false);
  const [columnsId, setColumnsId] = useState("");
  const [matchingValue, setMatchingValue] = useState("all");
  const [filters, setFilters] = useState({});
  const [filtersUpdated, setFiltersUpdated] = useState({});

  const [checked, setChecked] = useState(false);
  const [fields, setFields] = useState([]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        name: "firstName",
        operator: "is",
        value: "",
      },
    ]);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    if (
      field === "value" &&
      (newFields[index].name === "tag" ||
        newFields[index].name === "leadStatus" ||
        newFields[index].name === "country")
    ) {
      newFields[index][field] =
        typeof value === "string" ? value.split(",") : value;
    } else {
      newFields[index][field] = value;
    }
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [customFiltersOperation, setCustomFiltersOperation] = useState("any");
  const [customFilters, setCustomFilters] = useState([
    {
      name: "name",
      operator: "is",
      value: "Hassan",
    },
  ]);

  const [limit, setLimit] = useState(5);
  const [pages, setPage] = useState(1);

  const {
    data: getStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useGetStatusesQuery();
  const {
    data: views,
    isLoading: viewLoading,
    error: viewError,
  } = useGetFolderViewQuery();

  const [idChange, setIdChange] = useState("");
  const [tagCheckedId, setTagCheckedId] = useState({});
  const [tagCheckedIdSet, setTagCheckedIdSet] = useState({});

  const {
    data: getFolderName,
    isLoading: folderLoading,
    error: folderError,
  } = useGetProfileFolderNameQuery();
  const dateRanges =
    filters.created === "exactDate" ||
    filters.created === "customRange" ||
    filters.created === "beforeDate" ||
    filters.created === "afterDate" ||
    filters.updated === "exactDate" ||
    filters.updated === "customRange" ||
    filters.updated === "beforeDate" ||
    filters.updated === "afterDate";
  const fetchColumns = !viewLoading && views;
  const {
    data: columns,
    isLoading: columnLoading,
    error: columnError,
  } = useGetViewColumnsQuery(
    fetchColumns
      ? {
          id: columnsId ? columnsId : views?.result[0]?._id,
        }
      : skipToken
  );
  const convertedStartDate = dateRange[0]?.getTime();
  const convertedEndDate = dateRange[1]?.getTime();

  const {
    data: getProfiles,
    isFetching: isFetchingProfiles,
    isLoading,
    error,
  } = useGetAdminProfileQuery({
    page: pages,
    limit: limit,
    created:
      filters.created === "customRange"
        ? "customRange"
        : filters.created
        ? filters.created
        : "",

    creationDate:
      filters.created === "customRange"
        ? convertedStartDate
        : filters.creationDate,

    updationDate:
      filters.updated === "customRange"
        ? convertedStartDate
        : filtersUpdated.updationDate,

    creationEndDate: filters.created === "customRange" && convertedEndDate,
    updationEndDate: filters.updated === "customRange" && convertedEndDate,
    updated:
      filters.updated === "customRange"
        ? "customRange"
        : filters.updated
        ? filters.updated
        : "",

    search: search,
    sequence: sequences,
    customFilterOperation: matchingValue,
    customFilters: JSON.stringify(fields),
    tags: Object.keys(tagCheckedId).filter((key) => tagCheckedId[key]),
    statuses: statusCheckedId,
    viewId: columnsId ? columnsId : views?.result[0]?._id,
  });

  const {
    data: getTemplates,
    isLoading: templateLoading,
    error: templateError,
  } = useGetSequenceTemplatesQuery({
    page: 1,
    limit: 100,
  });

  const handleUpdateTag = async (id, tags) => {
    try {
      await updateTag({
        id: id,
        body: {
          tags: tags,
        },
      }).unwrap();
      toast.success("Tag updated successfully");
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error(error.data.message);
    }
  };
  const {
    data: addedSummariesData,
    isFetching: isFetchingAddedSummaries,
    isLoading: isLoadingAddedSummaries,
    error: addedSummariesError,
  } = useGetAllAddedSummariesQuery({
    page: pages,
    limit: limit,
    search: search,
  });
 const addedsu = addedSummariesData
 
  const handleCheckboxChange = (profileId, tag) => (event) => {
    const checked = event.target.checked;
    setTagChecked((prev) => ({
      ...prev,
      [tag._id]: checked,
    }));

    const updatedProfiles = getProfiles?.result?.allLeads?.map((profile) => {
      if (profile?._id === profileId) {
        const updatedTags = checked
          ? [...(profile?.tags || []), tag]
          : (profile?.tags || []).filter((t) => t?._id !== tag?._id);

        handleUpdateTag(profileId, updatedTags);

        return { ...profile, tags: updatedTags };
      }
      return profile;
    });

    return updatedProfiles;
  };

  const handleCheckboxChangeDrawer = (tag) => (event) => {
    setChecked(event.target.checked);
    let profileId = drawerProfileId;
    const checked = event.target.checked;
    setTagChecked((prev) => ({
      ...prev,
      [tag._id]: checked,
    }));

    const updatedProfiles = getProfiles?.result?.allLeads?.map((profile) => {
      if (profile?._id === profileId) {
        const updatedTags = checked
          ? [...(profile?.tags || []), tag]
          : (profile?.tags || []).filter((t) => t?._id !== tag?._id);

        handleUpdateTag(profileId, updatedTags);

        return { ...profile, tags: updatedTags };
      }
      return profile;
    });

    return updatedProfiles;
  };
  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getProfiles?.result?.totalRecord || 0;
  const [currentPage, setCurrentPage] = useState(
    getProfiles?.result?.currentPage || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getProfiles?.result?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getProfiles?.result?.limit)
        : 0
    ]
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setPage(page);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPage(currentPage + 1);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setPage(1);
    setLimit(Number(event.target.value));
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const pageRange = 5;
    let startPage = Math.max(currentPage - Math.floor(pageRange / 2), 1);
    let endPage = Math.min(startPage + pageRange - 1, totalPages);

    if (endPage - startPage < pageRange - 1) {
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const {
    data: getTags,
    isLoading: tagLoading,
    isFetching: isFetchingTags,
    error: tagError,
  } = useGetAllTagsQuery({
    search: tagSearch,
    ids: sendTags,
  });

  const [moveToFolder] = useMoveToFolderMutation();

  const colorPalette = [
    "#FEEE5E",
    "#B8EA68",
    "#99EDFF",
    "#D0B2FF",
    "#AB69FF",
    "#FFA3A2",
    "#FFB569",
    "#EAE9E8",
    "#E4D54C",
    "#59D095",
    "#69B3FF",
    "#6A69FF",
    "#D14EB4",
    "#FF6A69",
    "#BF884F",
    "#ADADAD",
    "#B99A2B",
    "#4EA67A",
    "#4F86BF",
    "#504FBF",
    "#873BA1",
    "#BF504F",
    "#897764",
    "#414C58",
  ];

  const handleInputChange = (index, value) => {
    const newFields = [...inputField];
    newFields[index] = { email: value };
    setInputField(newFields);
  };

  const handleAddEmail = () => {
    setInputField([...inputField, { email: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = [...inputField];
    newFields.splice(index, 1);
    setInputField(newFields);
  };
  const handleRemoveFieldDrawer = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const [updateColumns] = useUpdateColumnMutation();

  const handleUpdateColumns = async (order, nameIndex) => {
    try {
      // find column by name
      const column = columnData?.find((column) => column.name === nameIndex);

      await updateColumns({
        id: columnsId ? columnsId : views?.result[0]?._id,
        body: {
          field: "sort",
          value: order,
          columnId: column._id,
        },
      }).unwrap();
      toast.success("Columns updated successfully");
    } catch (error) {
      console.error("Error updating columns:", error);
      toast.error(error.data.message);
    }
  };

  const handleHideColumn = async (column) => {
    try {
      // find key display in column
      const key = Object.keys(column).find((key) => column[key] === true);
      await updateColumns({
        id: columnsId ? columnsId : views?.result[0]?._id,
        body: {
          field: key,
          value: false,
          columnId: column._id,
        },
      }).unwrap();
      toast.success("Column hidden successfully");
    } catch (error) {
      console.error("Error hiding column:", error);
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    if (columns?.result?.columns && !columnLoading) {
      setColumnData(columns.result.columns);
    }
  }, [columns, columnLoading]);

  const handleHideAndShowColumns = async (e, column) => {
    try {
      // check key from e.
      const checked = e.target.checked;
      // find key display in column
      setColumnData((prev) =>
        prev.map((col) =>
          col._id === column ? { ...col, display: checked } : col
        )
      );
      const key = Object.keys(column).find(
        (key) => column[key] === true || column[key] === false
      );

      await updateColumns({
        id: columnsId ? columnsId : views?.result[0]?._id,
        body: {
          field: key,
          value: checked,
          columnId: column._id,
        },
      }).unwrap();

      toast.success("Column updated successfully");
    } catch (error) {
      setColumnData((prev) =>
        prev.map((col) =>
          col._id === columnId ? { ...col, display: !checked } : col
        )
      );
      console.error("Error hiding column:", error);
      toast.error(error.data.message);
    }
  };

  const {
    data: getExportSettings,
    isLoading: exportLoading,
    error: exportError,
  } = useGetExportSettingsQuery();

  useEffect(() => {
    if (getExportSettings) {
      setInitialValues({
        ...initialValues,
        customColumns: getExportSettings.result.customColumns,
      });
    }
  }, [getExportSettings]);

  const handleClick = (item, index) => {
    if (index === 0) {
      setAllContant(true);
      setRecentlyCreated(false);
      setNewView(false);
      setColumnsId(item._id);
    }
    if (index === 1) {
      setAllContant(false);
      setRecentlyCreated(true);
      setNewView(false);
    }
  };
  const debounce = useRef();

  const handleSearchDebounced = (value) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  };

  const handleQueryChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    handleSearchDebounced(searchQuery);
  };

  useEffect(() => {
    if (folderId) {
      setIdChange(folderId);
    }
  }, [folderId]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [copied, setCopied] = useState(false);
  const [editDrawerName, setEditDrawerName] = useState("");
  const [linkedInId, setLinkedInId] = useState("");
  const [editDrawerAbout, setEditDrawerAbout] = useState("");
  const [editDrawerExperience, setEditDrawerExperience] = useState("");
  const [editDrawerEducation, setEditDrawerEducation] = useState("");
  const [editDrawerSkills, setEditDrawerSkills] = useState("");
  const [editDrawerAvatar, setEditDrawerAvatar] = useState("");
  const [editDrawerEmail, setEditDrawerEmail] = useState("");
  const [editDrawerPhone, setEditDrawerPhone] = useState("");
  const [drawerProfileId, setDrawerProfileId] = useState("");
  const [editDrawerProfile, setEditDrawerProfile] = useState("");
  const [editDrawerTags, setEditDrawerTags] = useState("");
  const [editDrawerNotes, setEditDrawerNotes] = useState("");
  const [editDrawerCreated, setEditDrawerCreated] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerOpenUpdated, setPickerOpenUpdated] = useState(false);
  const [pickerType, setPickerType] = useState("");
  const [editDrawerCountry, setEditDrawerCountry] = useState("");
  const [editDrawerCreatedDate, setEditDrawerCreatedDate] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const handleEdit = (profile) => {
    setEditDrawerCountry(profile?.country ? profile?.country : "");
    setLinkedInId(profile?.linkedInId);
    setEditDrawerCreated(profile?.created_at);
    setEditDrawerProfile(profile);
    setDrawerProfileId(profile._id);
    setEditDrawerTags(profile?.tags ? profile?.tags : "");
    setEditDrawerNotes(profile?.notes ? profile?.notes : "");
    setActiveDrawers(true);
    setEditDrawerName(profile?.name ? profile?.name : "");
    setEditDrawerAbout(profile?.about ? profile?.about : "");
    setEditDrawerExperience(
      profile?.currentPositions ? profile?.currentPositions : ""
    );
    setEditDrawerEducation(profile?.educations ? profile?.educations : "");
    setEditDrawerSkills(
      profile?.skills[0]?.title ? profile?.skills[0]?.title : ""
    );
    setEditDrawerAvatar(profile?.imageUrl ? profile?.imageUrl : "");
    setInputField(
      profile?.emails
        ? profile?.emails.map((email) => {
            return { email: email.email };
          })
        : [{ email: "" }]
    );
    setEditDrawerEmail(profile?.emails ? profile?.emails[0]?.email : "");
    setEditDrawerPhone(
      profile?.phones[0]?.phone ? profile?.phones[0]?.phone : ""
    );
  };
  const [copiedEmail, setCopiedEmail] = useState("");
  const handleCopy = (e, text, index) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(text?.email ? text?.email : text?.phone);
    setCopiedEmail(text?.email ? text?.email : text?.phone);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // const { data: checkData } = useCheckDataQuery();

  const createdAtData = [
    {
      name: "Today",
      value: "today",
    },
    {
      name: "Exact Date",
      value: "exactDate",
    },
    {
      name: "Before Date",
      value: "beforeDate",
    },
    {
      name: "After Date",
      value: "afterDate",
    },
    {
      name: "This Week",
      value: "thisWeek",
    },
    {
      name: "This Month",
      value: "thisMonth",
    },
    {
      name: "Last Month",
      value: "lastMonth",
    },
    {
      name: "Custom Range",
      value: "customRange",
    },
  ];

  const handleClickChange = (event, value) => {
    setActiveDropdown("");
    setFilters({ created: value });
    setAnchorEl(null);
    if (
      ["exactDate", "beforeDate", "afterDate", "customRange"].includes(value)
    ) {
      setPickerOpen(true);
    }
  };
  const handleClickChangeUpdated = (event, value) => {
    setActiveDropdown("");
    setFilters({ updated: value });
    setAnchorElUpdated(null);
    if (
      ["exactDate", "beforeDate", "afterDate", "customRange"].includes(value)
    ) {
      setPickerOpenUpdated(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFiltersUpdated("");

    let newDate = new Date(date).getTime();
    setFilters({
      ...filters,
      creationDate: newDate,
    });
    setPickerOpen(false);
  };

  const handleDateChangeUpdated = (date) => {
    setSelectedDate(date);
    let newDate = new Date(date).getTime();

    setFiltersUpdated({
      ...filtersUpdated,
      updationDate: newDate,
    });
    setPickerOpenUpdated(false);
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    setFilters({ created: range });
    // close the picker on second date selection
    if (range[0] && range[1] !== null && range[0] !== null && range[1]) {
      setPickerOpen(false);
    }
  };

  const handleRangeChangeUpdated = (range) => {
    setSelectedRange(range);
    setFilters({ updated: range });
    // close the picker on second date selection
    if (range[0] && range[1] !== null) {
      setPickerOpenUpdated(false);
    }
  };

  const matchingData = [
    {
      name: "All",
      value: "all",
    },
    {
      name: "Any",
      value: "any",
    },
  ];

  const handleOpenSmallScreenModal = (column, profile) => {
    setOpenToolTipColumn(column?.name);
    setOpenToolTipId(
      openToolTipId === profile._id && openToolTipColumn === column?.name
        ? null
        : profile._id
    );
  };
  const handleOpenSmallScreenModalEdit = (profile) => {
    setDrawerProfileIdToolTip(
      drawerProfileIdToolTip === profile ? null : profile
    );
  };
  const handleOpenTooltip = (columnName, profile) => {
    if (openToolTipId === profile._id && openToolTipColumn === columnName) {
      setOpenToolTipId(null);
      setOpenToolTipColumn(null);
    } else {
      setOpenToolTipId(profile._id);
      setOpenToolTipColumn(columnName);
    }
  };

  const handleOpenTooltipEdit = (profileId, open) => {
    setDrawerProfileIdToolTip((prevState) => ({
      ...prevState,
      [profileId]: open,
    }));
  };

  const selectData = [
    {
      name: "First Name",
      value: "firstName",
    },
    {
      name: "Last Name",
      value: "lastName",
    },
    {
      name: "company",
      value: "company",
    },
    {
      name: "lead status",
      value: "leadStatus",
    },
    {
      name: "assign to",
      value: "assignTo",
    },
    {
      name: "tag",
      value: "tag",
    },
    {
      name: "Country",
      value: "country",
    },
    {
      name: "City",
      value: "city",
    },
    {
      name: "State",
      value: "state",
    },
    {
      name: "Created At",
      value: "creationDate",
    },
    {
      name: "Updated At",
      value: "updationDate",
    },
  ];

  const optionsSelection = [
    {
      name: "is",
      value: "is",
    },
    {
      name: "is not",
      value: "isNot",
    },
    {
      name: "is blank",
      value: "isBlank",
    },
    {
      name: "is not blank",
      value: "isNotBlank",
    },
  ];

  const tagANdLeadStatusSelection = [
    {
      name: "is any of",
      value: "isAnyOf",
    },
    {
      name: "is non of",
      value: "isNonOf",
    },
    {
      name: "is blank",
      value: "isBlank",
    },
    {
      name: "is not blank",
      value: "isNotBlank",
    },
  ];

  const [editedProfileNoteEdit, setEditedProfileNoteEdit] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const [editedEmailFieldLeadId, setEditedEmailFieldLeadId] = useState("");
  const [ediIndex, setEditIndex] = useState("");
  const [editNoteDelete, setEditNoteDelete] = useState(false);
  const [updatedprofileEmailsEmail, setUpdatedprofileEmailsEmail] = useState({
    updates: {
      emails: [
        {
          validationStatus: 1,
          valid: true,
          email: "",
          type: "Direct",
          verified: false,
        },
      ],
    },
  });

  const handleUpdateProfile = async (index, profile) => {
    let notes;
    getProfiles?.result?.allLeads?.map((profiles) => {
      if (profiles?._id === (profile ? profile : editedEmailFieldLeadId)) {
        notes = profiles?.notes;
      }
      return profiles;
    });
    let emails = [];
    if (inputField) {
      for (let i = 0; i < inputField.length; i++) {
        let dataArray = {
          validationStatus: 1,
          valid: true,
          email: inputField[i].email,
          type: "Direct",
          verified: false,
        };

        emails.push(dataArray);
      }
    }

    let updatedNote = [];

    // check index and update profile
    if (editedProfileNoteEdit) {
      for (let i = 0; i < notes.length; i++) {
        if (i === ediIndex) {
          updatedNote.push(editNote);
        } else {
          updatedNote.push(notes[i]);
        }
      }
    }
    let updatedIndexDeleteNote = [];
    if (editNoteDelete && notes) {
      for (let i = 0; i < notes.length; i++) {
        if (i !== ediIndex) {
          updatedIndexDeleteNote.push(notes[i]);
        }
      }
    }

    try {
      await updateProfile({
        id: editedEmailFieldLeadId
          ? editedEmailFieldLeadId
          : editDrawerProfile?._id,
        body: {
          updates: editedProfileNoteEdit
            ? {
                notes: updatedNote,
              }
            : editNoteDelete
            ? {
                notes: updatedIndexDeleteNote,
              }
            : {
                emails: emails,
              },
        },
      }).unwrap();
      toast.success("updated successfully");
      setOpenEditPopOverDrawer(false);
      setOpenEditNoteInput(false);
      setEditedProfileNoteEdit(false);
      setEditNoteDelete(false);
      setEditDrawerEmail("");
      setEditDrawerPhone("");
      setEditedEmailFieldLeadId("");
      setEditDrawerProfile("");
      handleConfirmCloseLeadNote();
    } catch (error) {
      console.error("Error updating:", error);
      toast.error(error.data.message);
      setOpenEditPopOverDrawer(false);
      setOpenEditNoteInput(false);
      setEditedProfileNoteEdit(false);
      setEditNoteDelete(false);
      handleConfirmCloseLeadNote();
    }
  };

  const handleSelectProfile = (e, profile) => {
    setFolderIds(profile?.folderId);
    // get profile?.tags _id
    setSelectedTagIds([
      ...selectedTagIds,
      ...new Set(profile?.tags.map((tag) => tag?._id)),
    ]);
    if (e.target.checked) {
      setSelectedProfiles([...selectedProfiles, profile?._id]);
    } else {
      setSelectedProfiles(
        selectedProfiles.filter(
          (selectedProfile) => selectedProfile !== profile?._id
        )
      );
    }
  };
  const [composeEmail] = useComposeEmailMutation();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      // if (inputValue) {
      //   if (!fieldValuePairs.includes(inputValue.trim())) {
      //     setFieldValuePairs([
      //       ...fieldValuePairs,
      //       { email: { email: inputValue.trim() } },
      //     ]);
      //     setInputValue("");
      //   }
      // }
      // Extract the email strings from the `fieldValuePairs` array
      const formData = new FormData();
      const emailArray = fieldValuePairs.map((item) => item.email.email);

      formData.append("to[]", JSON.stringify(emailArray)); // Convert array to JSON string
      formData.append("subject", editTemplateSubject);
      formData.append("body", editorValue);
      formData.append("leadId", editTemplateLeadId);

      await composeEmail({
        body: formData,
      }).unwrap();

      toast.success("Emails sent successfully");
      handleCloseTemplate();

      setFieldValue("");
      setExpanded(false);
    } catch (error) {
      console.log(error);
      // toast.error(error.data.message);
    }
  };

  const createLeadSequence = async (e) => {
    e.preventDefault();
    try {
      await createSequence({
        body: {
          name: editTemplateName,
          leadId: editTemplateLeadId,
          subject: editTemplateSubject,
          sequenceTemplate: editTemplateId,
          mailStatus: "Send",
        },
      }).unwrap();
      toast.success("Sequence created successfully");
      handleCloseTemplate();
      setEditTemplateLeadId("");
      setEditTemplateName(""), setEditTemplateEmail("");
      setEditTemplateSubject("");
      handleCloseTemplate();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const handleClearTags = () => {
    setTagCheckedId({});
  };

  const handleClearFilters = () => {
    setFilters({ created: "", updated: "" });
    setSelectedDate(null);
    setSelectedRange([null, null]);
  };

  const handleDeleteImportLead = async () => {
    try {
      const res = await deleteImport().unwrap();
      toast.success(
        res?.message ? res?.message : "Import deleted successfully"
      );
      setOpenImportDeleted(false);
    } catch (error) {
      console.error("Error deleting import:", error);
      toast.error("Error deleting import");
    }
  };

  const selectedTagCount = Object.values(tagCheckedId).filter(Boolean).length;

  if (
    isLoading ||
    statusLoading ||
    viewLoading ||
    columnLoading ||
    folderLoading ||
    templateLoading ||
    exportLoading ||
    tagLoading ||
    isLoading ||
    columnData?.length === 0 ||
    columnData === undefined
  ) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "transparent",
          height: "70vh",
        }}
      >
        <img
          src="https://d2ds8yldqp7gxv.cloudfront.net/lead/jarvis-logo.png"
          alt="logo"
          width="200"
          height="33"
        />
        <CircularProgress style={{ color: "red", fontSize: "100px" }} />
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
      </div>
    );
  }
  const handleImportChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportValue(file);
      readExcelData(file);
    }
  };

  const readExcelData = (file) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const fileContent = event.target.result;
     
    };

    reader.readAsArrayBuffer(file); // Read the file as an array buffer
  };
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importValue) {
      toast.error("Please upload a valid CSV file or enter a valid Excel file");
      setUploadImportFileError(true);
      return;
    }
    if (!importEmail) {
      toast.error("Please enter a valid email");
      setUploadImportFileError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", importValue);
      formData.append("email", importEmail);
      setImportsLoading(true);
      await imports({
        body: formData,
      }).unwrap();
      setImportsLoading(false);
      setIsImportsComplete(true);
      toast.success(
        "Imports are in progress. You will be notified through email when imports are completed."
      );
      setUploadImportFileError(false);
      setTimeout(() => {
        setImportValue("");
        setIsImportsComplete(false);
        setOpenImportDrawer(false);
      }, 2000);
    } catch (error) {
      setImportsLoading(false);
      setIsImportsComplete(false);
      console.error("Error importing contacts:", error);
      toast.error(error.data.message);
    }
  };

  // check importValue is CSV or not
  // const handleCheckCSV = (e) => {
  //   e.preventDefault();

  //   if (importValue) {
  //     const file = importValue;
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const text = e.target.result;
  //       const result = text.split("\n");
  //       const headers = result[0].split(",");
  //       if (headers.length === 1) {
  //         toast.error("Please upload a valid CSV file");
  //       } else {
  //         handleImportSubmit();
  //       }
  //     };
  //   }
  // };
  const filteredFiles = addedSummariesData && addedSummariesData.addedData
  ? addedSummariesData.addedData.filter((item) =>
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : []; 
const uniqueFiles = filteredFiles.length > 0 
  ? [...new Set(filteredFiles.map(item => item.filename))]
  : []; 

const totalFileData = addedSummariesData && addedSummariesData.totalFileData 
  ? addedSummariesData.totalFileData
  : 0;


  return (
    <div>
      {/* <!-- Begin page --> */}
      <div id="wrapper">
        {/* 
        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== -->

        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== --> */}

        <div
          className="content-page"
          style={
            isSmallScreen
              ? {
                  paddingRight: "0px",
                }
              : {
                  paddingRight: "20px",
                }
          }
        >
          <div className="content">
            {/* <!-- Start Content--> */}

            {/* <!-- end page title -->  */}
            {/* <!-- Start Content--> */}
            <div className="container-fluid">
              {/* <!-- start page title --> */}
              <div
                className="row"
                style={
                  !isSmallScreen && allContant && !collapsed && !isMd
                    ? {
                        maxWidth: "calc(100% - 220px)",
                      }
                    : {
                        maxWidth: "calc(100% - 10px)",
                      }
                }
              >
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                          <a>Jarvis Reach</a>
                        </li>
                        <li className="breadcrumb-item active">Data Manager</li>
                      </ol>
                    </div>
                    <h4 className="page-title">Data Manager</h4>
                  </div>
                </div>
              </div>
              <div
                className="row"
                style={
                  !isSmallScreen && allContant && !collapsed && !isMd
                    ? {
                        maxWidth: "calc(100% - 220px)",
                      }
                    : {
                        maxWidth: "calc(100% - 10px)",
                      }
                }
              >
                <div className="col-12">
                  <ClickAwayListener
                    onClickAway={() => {
                      setActiveDropdown("");
                    }}
                  >
                    <div className="card">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="header-title mb-4">
                                Data Manager
                              </h4>
                              <ul className="nav nav-tabs">
                                {/* <li
                                className="nav-item"
                                onClick={() => {
                                  setAllContant(true);
                                  setRecentlyCreated(false);
                                  setNewView(false);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <a
                                  data-bs-toggle="tab"
                                  aria-expanded="false"
                                  className={`nav-link ${
                                    allContant ? "active" : ""
                                  }`}
                                  style={{
                                    color: "#6c757d",
                                    fontSize: "14px",
                                    fontFamily: "Nunito, Sans-serif",
                                    fontWeight: 600,
                                  }}
                                >
                                  All contacts
                                </a>
                              </li>
                              <li
                                style={{
                                  cursor: "pointer",
                                }}
                                className="nav-item"
                                onClick={() => {
                                  setAllContant(false);
                                  setRecentlyCreated(true);
                                  setNewView(false);
                                }}
                              >
                                <a
                                  data-bs-toggle="tab"
                                  aria-expanded="true"
                                  className={`nav-link ${
                                    recentlyCreated ? "active" : ""
                                  }`}
                                  style={{
                                    color: "#6c757d",
                                    fontSize: "14px",
                                    fontFamily: "Nunito, Sans-serif",
                                    fontWeight: 600,
                                  }}
                                >
                                  Recently created by me
                                </a>
                              </li> */}
                                {views?.result?.length > 0 &&
                                  views.result.map((item, index) => (
                                    <li
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="nav-item"
                                      onClick={() => handleClick(item, index)}
                                    >
                                      <a
                                        data-bs-toggle="tab"
                                        aria-expanded="false"
                                        className={`nav-link ${
                                          allContant && index === 0 && !newView
                                            ? " active"
                                            : recentlyCreated &&
                                              index === 1 &&
                                              !newView
                                            ? " active"
                                            : ""
                                        }`}
                                        style={{
                                          color: "#6c757d",
                                          fontSize: "14px",
                                          fontFamily: "Nunito, Sans-serif",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {item.name}
                                      </a>
                                    </li>
                                  ))}
                                {/* <li
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  className="nav-item"
                                  onClick={() => {
                                    setNewView(true);
                                  }}
                                >
                                  <a
                                    data-bs-toggle="tab"
                                    aria-expanded="false"
                                    className={`nav-link ${
                                      newView ? "active" : ""
                                    }`}
                                    style={{
                                      color: "#6c757d",
                                      fontSize: "14px",
                                      fontFamily: "Nunito, Sans-serif",
                                      fontWeight: 600,
                                    }}
                                  >
                                    + New View
                                  </a>
                                </li> */}
                              </ul>{" "}
                              <div className="tab-content">
                                {allContant && (
                                  <div className="tab-pane" id="allContacts">
                                    {selectedProfiles.length > 0 ? (
                                      <div
                                        className="d-flex justify-content-between 
                                      
                                      "
                                        style={
                                          isSmallScreen && isMd
                                            ? {
                                                flexDirection: "column",
                                                alignItems: "self-start",
                                                alignContent: "flex-start",
                                                justifyContent: "start",
                                              }
                                            : {
                                                flexDirection: "row",
                                              }
                                        }
                                      >
                                        <div>
                                          <h4 className="header-title mb-4">
                                            {selectedProfiles.length} selected
                                          </h4>
                                        </div>
                                        <div
                                          id={templateEl}
                                          className={` ${
                                            isSmallScreen
                                              ? ""
                                              : "d-grid gap-2 d-md-flex justify-content-md-end align-items-md-center"
                                          }   ,
                                    `}
                                        >
                                          {/* <button
                                            className="btn btn-light border-0"
                                            onClick={(e) => {
                                              setOpenMoveToTemplate(true);
                                              setTemplateEl(e.currentTarget);
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                            }}
                                          >
                                            <CgTemplate
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Assign Sequence
                                          </button>
                                          <Popover
                                            open={openMoveToTemplate}
                                            anchorEl={templateEl}
                                            onClose={() => {
                                              setOpenMoveToTemplate(false);
                                            }}
                                            anchorOrigin={{
                                              vertical: "bottom",
                                              horizontal: "center",
                                            }}
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "center",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px",
                                                width: "200px",
                                                padding: "10px",
                                              }}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Search"
                                                startAdornment={
                                                  <InputAdornment position="start">
                                                    <Search />
                                                  </InputAdornment>
                                                }
                                                value={searchTemplate}
                                                onChange={(e) => {
                                                  setSearchTemplate(
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                              {getTemplates?.result
                                                .filter(
                                                  (item) =>
                                                    !searchTemplate ||
                                                    searchTemplate
                                                      .toLocaleLowerCase()
                                                      .includes(
                                                        item.name.toLocaleLowerCase()
                                                      )
                                                )
                                                .map((item) => (
                                                  <MenuItem
                                                    key={item._id}
                                                    onClick={() => {
                                                      assignTemplate({
                                                        body: {
                                                          templateId: item._id,
                                                          ids: selectedProfiles,
                                                        },
                                                      })
                                                        .unwrap()
                                                        .then(() => {
                                                          toast.success(
                                                            "Assigned template successfully"
                                                          );
                                                        })
                                                        .catch((error) => {
                                                          console.error(
                                                            "Error assigning template: ",
                                                            error.data
                                                          );
                                                          toast.error(
                                                            error.data.message
                                                          );
                                                        });
                                                      setOpenMoveToTemplate(
                                                        false
                                                      );
                                                      setSelectedProfiles([]);
                                                      createSequence({
                                                        body: {
                                                          name: item?.name,
                                                          ids: selectedProfiles,
                                                          subject:
                                                            item?.subject,
                                                          sequenceTemplate:
                                                            item?._id,
                                                          mailStatus: "Send",
                                                        },
                                                      })
                                                        .unwrap()
                                                        .then(() => {
                                                          toast.success(
                                                            "Sequence created successfully"
                                                          );
                                                          handleCloseTemplate();
                                                          setEditTemplateLeadId(
                                                            ""
                                                          );
                                                          setEditTemplateName(
                                                            ""
                                                          ),
                                                            setEditTemplateEmail(
                                                              ""
                                                            );
                                                          setEditTemplateSubject(
                                                            ""
                                                          );
                                                          handleCloseTemplate();
                                                        })
                                                        .catch((error) => {
                                                          console.error(
                                                            "Error creating sequence: ",
                                                            error.data
                                                          );
                                                          toast.error(
                                                            error.data.message
                                                          );
                                                        });
                                                    }}
                                                  >
                                                    <FaMailBulk
                                                      style={{
                                                        color: item.color,
                                                        marginRight: "5px",
                                                        width: "20px",
                                                        height: "20px",
                                                      }}
                                                    />
                                                    {item.name}
                                                  </MenuItem>
                                                ))}
                                            </Box>
                                          </Popover>
                                          <button
                                            className="btn btn-light border-0"
                                            onClick={(e) => {
                                              setOpenMoveToFolder(true);
                                              setMoveFolderEl(e.currentTarget);
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                            }}
                                          >
                                            <CgFolderRemove
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Move to folder
                                          </button>
                                          <Popover
                                            open={openMoveToFolder}
                                            anchorEl={moveFolderEl}
                                            onClose={() => {
                                              setOpenMoveToFolder(false);
                                            }}
                                            anchorOrigin={{
                                              vertical: "bottom",
                                              horizontal: "center",
                                            }}
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "center",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "5px",
                                                width: "200px",
                                                padding: "10px",
                                              }}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Search"
                                                startAdornment={
                                                  <InputAdornment position="start">
                                                    <Search />
                                                  </InputAdornment>
                                                }
                                                value={searchFolder}
                                                onChange={(e) => {
                                                  setSearchFolder(
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                              <Divider />
                                              {getFolderName?.result
                                                .filter(
                                                  (item) =>
                                                    !searchFolder ||
                                                    searchFolder
                                                      .toLocaleLowerCase()
                                                      .includes(
                                                        item.name.toLocaleLowerCase()
                                                      )
                                                )
                                                .map((item) => (
                                                  <MenuItem
                                                    key={item._id}
                                                    onClick={() => {
                                                      moveToFolder({
                                                        body: {
                                                          destinationFolderId:
                                                            item._id,
                                                          leadIds:
                                                            selectedProfiles,
                                                        },
                                                      })
                                                        .unwrap()
                                                        .then(() => {
                                                          toast.success(
                                                            "Moved to folder successfully"
                                                          );
                                                        })
                                                        .catch((error) => {
                                                          console.error(
                                                            "Error moving to folder:",
                                                            error
                                                          );
                                                          toast.error(
                                                            error.data.message
                                                          );
                                                        });
                                                      setOpenMoveToFolder(
                                                        false
                                                      );
                                                      setSelectedProfiles([]);
                                                    }}
                                                  >
                                                    <Folder
                                                      style={{
                                                        color: item.color,
                                                        marginRight: "5px",
                                                        width: "20px",
                                                        height: "20px",
                                                      }}
                                                    />
                                                    {item.name}
                                                  </MenuItem>
                                                ))}
                                            </Box>
                                          </Popover> */}
                                          <button
                                            className="btn btn-light border-0"
                                            onClick={(e) => {
                                              setTagPopover(true);
                                              setTagPopoverEl(e.currentTarget);
                                              setSendTags([]);
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                              width: "100px",
                                            }}
                                          >
                                            <FaTag
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Tag
                                          </button>
                                          <button
                                            className="btn btn-light border-0"
                                            onClick={(e) => {
                                              setTagPopover(true);
                                              setTagPopoverEl(e.currentTarget);
                                              setSendTags(selectedTagIds);
                                              setUntag(true);
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                            }}
                                          >
                                            <FaMinus
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                height: "10px",
                                                width: "20px",
                                                marginRight: "3px",
                                              }}
                                            />
                                            Untag
                                          </button>

                                          <Popover
                                            open={tagPopover}
                                            anchorEl={tagPopoverEl}
                                            onClose={() => {
                                              setTagPopover(false);
                                            }}
                                            anchorOrigin={{
                                              vertical: "bottom",
                                              horizontal: "left",
                                            }}
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "left",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                p: 2,
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                borderRadius: 1,
                                              }}
                                            >
                                              <div className="add-our-tags">
                                                {getTags?.result.length ===
                                                0 ? (
                                                  <>
                                                    <img src="assets/images/users/projects-empty-state.svg" />
                                                    <p>
                                                      Organize your contacts in
                                                      tags
                                                    </p>
                                                    <button
                                                      type="button"
                                                      className="btn btn-add"
                                                      onClick={(e) => {
                                                        handleEditFolderName();
                                                        setTagIds(profile._id);
                                                        setTagPopoverEl(
                                                          e.currentTarget
                                                        );
                                                      }}
                                                    >
                                                      {" "}
                                                      Create your first Tag
                                                    </button>
                                                  </>
                                                ) : addTag ? (
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      gap: "10px",
                                                    }}
                                                  >
                                                    <Typography
                                                      sx={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        fontSize: "18px",
                                                      }}
                                                    >
                                                      <FaTag
                                                        style={{
                                                          color: "#000",
                                                          width: "20px",
                                                          height: "20px",
                                                        }}
                                                      />
                                                      Tags
                                                    </Typography>
                                                    <Divider
                                                      sx={{
                                                        backgroundColor:
                                                          "#f4f4f4",
                                                      }}
                                                    />
                                                    <TextField
                                                      id="outlined-basic"
                                                      label="Search tags"
                                                      variant="outlined"
                                                      value={tagSearch}
                                                      onChange={(e) =>
                                                        setTagSearch(
                                                          e.target.value
                                                        )
                                                      }
                                                      sx={{
                                                        width: "100%",
                                                        fontSize: "10px",
                                                        "& .MuiOutlinedInput-root":
                                                          {
                                                            height: "45px",
                                                            padding: " 10px",
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                          },
                                                      }}
                                                    />
                                                    <Divider
                                                      sx={{
                                                        backgroundColor:
                                                          "#f4f4f4",
                                                      }}
                                                    />
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        height: "200px",
                                                        overflowY: "auto",
                                                        lineHeight: "0.5",
                                                      }}
                                                    >
                                                      {!isFetchingTags &&
                                                        !tagLoading &&
                                                        getTags?.result?.map(
                                                          (tag) => (
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                              key={tag?._id}
                                                            >
                                                              <Checkbox
                                                                value={tag?._id}
                                                                // checked={
                                                                // }
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  const checked =
                                                                    e.target
                                                                      .checked;
                                                                  // setTagCheckedIdSet(
                                                                  //   (prev) => ({
                                                                  //     ...prev,

                                                                  //   })
                                                                  // );

                                                                  // const checkedTagId = {
                                                                  //   ...tagCheckedId,
                                                                  //   [tag._id],
                                                                  // };
                                                                  const getProfilesTag =
                                                                    getProfiles?.result?.allLeads?.map(
                                                                      (
                                                                        profile
                                                                      ) => {
                                                                        if (
                                                                          selectedProfiles.includes(
                                                                            profile._id
                                                                          )
                                                                        ) {
                                                                          return (
                                                                            profile.tags?.map(
                                                                              (
                                                                                tag
                                                                              ) =>
                                                                                tag?._id
                                                                            ) ||
                                                                            []
                                                                          );
                                                                        }
                                                                      }
                                                                    );
                                                                  try {
                                                                    const tadIds =
                                                                      getProfilesTag;

                                                                    // remove null values from array
                                                                    const filtered =
                                                                      tadIds.filter(
                                                                        (el) =>
                                                                          el !=
                                                                          null
                                                                      );
                                                                    profileTagAndU(
                                                                      {
                                                                        body: {
                                                                          leadIds:
                                                                            selectedProfiles,
                                                                          action:
                                                                            untag
                                                                              ? "untag"
                                                                              : "tag",
                                                                          tagIds:
                                                                            [
                                                                              ...filtered.flat(),
                                                                              tag._id,
                                                                            ],
                                                                        },
                                                                      }
                                                                    )
                                                                      .unwrap()
                                                                      .then(
                                                                        (
                                                                          res
                                                                        ) => {
                                                                          toast.success(
                                                                            "Tag successfull"
                                                                          );
                                                                        }
                                                                      );

                                                                    setUntag(
                                                                      false
                                                                    );
                                                                    setSelectedTagIds(
                                                                      []
                                                                    );
                                                                    setSendTags(
                                                                      []
                                                                    );
                                                                    setSelectedProfiles(
                                                                      []
                                                                    );
                                                                  } catch (error) {
                                                                    console.error(
                                                                      "Error adding note:",
                                                                      error
                                                                    );
                                                                    toast.error(
                                                                      error.data
                                                                        .message
                                                                    );

                                                                    setUntag(
                                                                      false
                                                                    );
                                                                  }
                                                                  setTagPopover(
                                                                    false
                                                                  );
                                                                }}
                                                              />
                                                              <p>
                                                                <FaTag
                                                                  style={{
                                                                    color:
                                                                      tag?.color,
                                                                    width:
                                                                      "20px",
                                                                    height:
                                                                      "20px",
                                                                    marginRight:
                                                                      "5px",
                                                                  }}
                                                                />
                                                                {tag?.name}
                                                              </p>
                                                            </Box>
                                                          )
                                                        )}
                                                    </Box>
                                                    <Divider
                                                      sx={{
                                                        backgroundColor:
                                                          "#f4f4f4",
                                                      }}
                                                    />
                                                    <Button
                                                      variant="contained"
                                                      sx={{
                                                        backgroundColor:
                                                          "#f4f4f4",
                                                        color: "#000",
                                                        textTransform:
                                                          "capitalize",
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#f4f4f4",
                                                        },
                                                      }}
                                                      onClick={() => {
                                                        setAddTag(false);
                                                      }}
                                                    >
                                                      + New tag
                                                    </Button>
                                                  </Box>
                                                ) : (
                                                  <div className="modal-dialog modal-dialog-centered modal-sm">
                                                    <div className="modal-content">
                                                      <div className="modal-header">
                                                        {/* back button */}

                                                        <h1
                                                          className="modal-title fs-5"
                                                          style={{
                                                            whiteSpace:
                                                              "nowrap",
                                                            width: "100%",
                                                            fontWeight: 600,
                                                            fontSize: "14px",
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <ChevronLeft
                                                            onClick={() => {
                                                              setAddTag(true);
                                                            }}
                                                            sx={{
                                                              color: "#000",
                                                              cursor: "pointer",
                                                              fontSize: "20px",
                                                              marginRight:
                                                                "10px",
                                                            }}
                                                          />
                                                          New Tag
                                                        </h1>
                                                        <hr />
                                                      </div>
                                                      <div className="modal-body">
                                                        <form>
                                                          <div className="mb-2">
                                                            <input
                                                              type="text"
                                                              className="form-control"
                                                              name="name"
                                                              placeholder="Tage Name"
                                                              value={editName}
                                                              onChange={(e) => {
                                                                setEditName(
                                                                  e.target.value
                                                                );
                                                              }}
                                                            />
                                                          </div>

                                                          <div className="color-option mb-3">
                                                            <h5
                                                              style={{
                                                                fontWeight: 600,
                                                                marginBottom:
                                                                  "10px",
                                                                textAlign:
                                                                  "left",
                                                              }}
                                                            >
                                                              Set Color
                                                            </h5>
                                                            <div className="d-flex flex-wrap">
                                                              {colorPalette.map(
                                                                (
                                                                  color,
                                                                  index
                                                                ) => (
                                                                  <Box
                                                                    key={index}
                                                                    sx={{
                                                                      width: 24,
                                                                      height: 24,
                                                                      backgroundColor:
                                                                        color,
                                                                      borderRadius:
                                                                        "50%",
                                                                      margin: 0.5,
                                                                      cursor:
                                                                        "pointer",
                                                                      border:
                                                                        editColor ===
                                                                        color
                                                                          ? "2px solid #000"
                                                                          : "2px solid transparent",
                                                                    }}
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      setEditColor(
                                                                        color
                                                                      );
                                                                    }}
                                                                  />
                                                                )
                                                              )}
                                                            </div>
                                                            {/* <div className="mt-2">
                                                                                    Selected Color: {selectedColor}
                                                                                  </div> */}
                                                          </div>

                                                          <div className="  d-md-flex justify-content-md-end">
                                                            <button
                                                              className="btn btn-secondary "
                                                              style={{
                                                                backgroundColor:
                                                                  "#000",
                                                                color: "#fff",
                                                                backgroundColor:
                                                                  "#000",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                                width: "100px",
                                                                whiteSpace:
                                                                  "nowrap",
                                                              }}
                                                              type="button"
                                                              onClick={() => {
                                                                handleCreateTags();
                                                                setAddTag(true);
                                                              }}
                                                            >
                                                              Create Tag
                                                            </button>
                                                          </div>
                                                        </form>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </Box>
                                          </Popover>

                                          {/* Lead Status */}
                                          <button
                                            className="btn btn-light border-0"
                                            onClick={(e) => {
                                              setActiveDropdownLeadStatus(true);
                                              setAnchorElLeadStatus(
                                                e.currentTarget
                                              );
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                            }}
                                          >
                                            <FaUserCheck
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Lead Status
                                          </button>
                                         
                                          <Popover
                                            open={activeDropdownLeadStatus}
                                            anchorEl={anchorElLeadStatus}
                                            onClose={() => {
                                              setActiveDropdownLeadStatus(
                                                false
                                              );
                                            }}
                                            anchorOrigin={{
                                              vertical: "bottom",
                                              horizontal: "left",
                                            }}
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "left",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                p: 2,
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                borderRadius: 1,
                                              }}
                                            >
                                              <div className="popover__content">
                                                <div className="leading-states">
                                                  <div className="leading-states-left">
                                                    <h5
                                                      style={{
                                                        whiteSpace: "nowrap",
                                                      }}
                                                    >
                                                      <FaAddressCard
                                                        style={{
                                                          color: "#000",
                                                          width: "20px",
                                                          height: "20px",
                                                        }}
                                                      />
                                                      Lead Status
                                                    </h5>

                                                    
                                                  </div>
                                                  <div className="leading-states-right">
                                                    {/* <a >
                                                                    Set Order
                                                                  </a> */}
                                                  </div>
                                                </div>
                                                {
                                                  <div className="most-checkboxes">
                                                    {getStatus?.result?.leadsStatuses?.map(
                                                      (option, index) => (
                                                        <div
                                                          className={`form-check mb-2 ${option.color}`}
                                                          key={index}
                                                        >
                                                          <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            // radio
                                                            typeof="radio"
                                                            name="flexRadioDefault"
                                                            id={`customradio${
                                                              index + 1
                                                            }`}
                                                            checked={
                                                              getProfiles?.result?.allLeads?.find(
                                                                (profile) =>
                                                                  selectedProfiles.includes(
                                                                    profile._id
                                                                  )
                                                              )?.status?._id ===
                                                              option._id
                                                            }
                                                            onChange={(e) => {
                                                              const checked =
                                                                e.target
                                                                  .checked;
                                                              if (checked) {
                                                                try {
                                                                  profilemultipleTag(
                                                                    {
                                                                      body: {
                                                                        leadIds:
                                                                          selectedProfiles,
                                                                        statusId:
                                                                          option._id,
                                                                      },
                                                                    }
                                                                  )
                                                                    .unwrap()
                                                                    .then(
                                                                      () => {
                                                                        toast.success(
                                                                          "Status updated successfully"
                                                                        );
                                                                      }
                                                                    )
                                                                    .catch(
                                                                      (
                                                                        error
                                                                      ) => {
                                                                        console.error(
                                                                          "Error updating status:",
                                                                          error
                                                                        );
                                                                        toast.error(
                                                                          error
                                                                            .data
                                                                            .message
                                                                        );
                                                                      }
                                                                    );
                                                                } catch (error) {
                                                                  console.error(
                                                                    "Error updating status:",
                                                                    error
                                                                  );
                                                                  toast.error(
                                                                    error.data
                                                                      .message
                                                                  );
                                                                }
                                                                setActiveDropdownLeadStatus(
                                                                  false
                                                                );
                                                              }
                                                            }}
                                                          />
                                                          <label
                                                            className="form-check-label"
                                                            htmlFor={`customradio${
                                                              index + 1
                                                            }`}
                                                          >
                                                            <LabelImportant
                                                              style={{
                                                                color:
                                                                  option.color,
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight:
                                                                  "5px",
                                                              }}
                                                            />
                                                            {option.name}
                                                          </label>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                }
                                              </div>{" "}
                                            </Box>
                                          </Popover>

                                          <button
                                            className="btn btn-light border-0"
                                            onClick={() => {
                                              setActiveDropdownExport(true);
                                            }}
                                            style={{
                                              color: "#6a69ff",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                              width: "100px",
                                            }}
                                          >
                                            <FaDownload
                                              style={{
                                                color: "#6a69ff",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Export
                                          </button>

                                          <button
                                            className="btn btn-light border-0"
                                            onClick={() => {
                                              setConfirmOpenLead(true);
                                            }}
                                            style={{
                                              color: "#ff6a69",
                                              fontSize: "16px",
                                              display: "flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              "&:hover": {
                                                backgroundColor: "#f3f7f9",
                                              },
                                            }}
                                          >
                                            <FaTrash
                                              style={{
                                                color: "#ff6a69",
                                                fontSize: "20px",
                                                marginRight: "5px",
                                              }}
                                            />
                                            Delete
                                          </button>
                                          <Dialog
                                            open={confirmOpenLead}
                                            onClose={handleConfirmCloseLead}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                          >
                                            <DialogTitle id="alert-dialog-title">
                                              {"Confirm Deletion"}
                                            </DialogTitle>
                                            <DialogContent>
                                              <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete
                                                this Lead?
                                              </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                              <Button
                                                onClick={handleConfirmCloseLead}
                                                color="primary"
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                sx={{
                                                  color: "#ff0000",
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                }}
                                                onClick={handleConfirmDelete}
                                                color="primary"
                                                autoFocus
                                              >
                                                Delete
                                              </Button>
                                            </DialogActions>
                                          </Dialog>
                                        </div>
                                      </div>
                                    ) : (
                                      <ClickAwayListener
                                        onClickAway={() => {
                                          setActiveDropdown("");
                                        }}
                                      >
                                        <div
                                          className={` ${
                                            isSmallScreen ? "" : "row mb-2"
                                          }   ,
                                    width: "100%"
                                
                                `}
                                        >
                                          <div className="col-sm-2">
                                            <div
                                              className={`${
                                                isSmallScreen ? "" : "d-flex"
                                              }`}
                                            >
                                              <form className="mb-2 mb-sm-0">
                                                <label
                                                  for="inputPassword2"
                                                  className="visually-hidden"
                                                >
                                                  Search
                                                </label>
                                                <input
                                                  type="search"
                                                  className="form-control"
                                                  id="inputPassword2"
                                                  placeholder="Search Name"
                                                  value={query}
                                                  onChange={(e) => {
                                                    handleQueryChange(e);
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                />
                                              </form>
                                            </div>
                                          </div>
                                          <div className="col-sm-6">
                                            <div
                                              className="btn-group mb-2"
                                              style={{ paddingRight: "5px" }}
                                            >
                                              <Button
                                                type="button"
                                                className={`btn btn-light dropdown-toggle ${
                                                  activeDropdown === "tags"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  activeDropdown === "tags"
                                                }
                                                onClick={(e) => {
                                                  handleDropdownToggle("tags");
                                                  setAnchorElId(
                                                    e.currentTarget
                                                  );
                                                }}
                                                id={anchorElId}
                                                style={{
                                                  color: "#343a40",
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                  fontFamily:
                                                    "Nunito, Sans-serif",
                                                  // not in uppercase
                                                  textTransform: "none",
                                                  backgroundColor: "#f3f7f9",
                                                }}
                                              >
                                                Tags{" "}
                                                {selectedTagCount > 0 && (
                                                  <>
                                                    {`(${selectedTagCount})`}
                                                    <span
                                                      style={{
                                                        zIndex: 9999,
                                                      }}
                                                      onClick={handleClearTags}
                                                    >
                                                      {/* cross icon */}
                                                      <FaTimes
                                                        style={{
                                                          color: "#ff0000",
                                                          fontSize: "12px",
                                                          marginLeft: "5px",
                                                        }}
                                                      />
                                                    </span>
                                                  </>
                                                )}
                                                <i className="mdi mdi-chevron-down"></i>
                                              </Button>
                                              <div
                                                className={`dropdown-menu ${
                                                  activeDropdown === "tags"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                style={{
                                                  width: "300px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <div
                                                  className="popover__content"
                                                  id={anchorElId}
                                                  style={{
                                                    backgroundColor: "#fff",
                                                    boxShadow: "none",
                                                  }}
                                                >
                                                  <div className="add-our-tags">
                                                    {getTags?.result.length ===
                                                    0 ? (
                                                      <>
                                                        <img
                                                          src="assets/images/users/projects-empty-state.svg"
                                                          alt="Empty State"
                                                        />
                                                        <p>
                                                          Organize your contacts
                                                          in tags
                                                        </p>
                                                        <button
                                                          type="button"
                                                          className="btn btn-add"
                                                          onClick={(e) => {
                                                            handleEditFolderName();
                                                            setAnchorElId(
                                                              e.currentTarget
                                                            );
                                                          }}
                                                        >
                                                          Create your first Tag
                                                        </button>
                                                      </>
                                                    ) : addTag ? (
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          gap: "10px",
                                                        }}
                                                      >
                                                        <Typography
                                                          sx={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            alignItems:
                                                              "center",
                                                            fontSize: "18px",
                                                          }}
                                                        >
                                                          <FaTag
                                                            style={{
                                                              color: "#000",
                                                              width: "20px",
                                                              height: "20px",
                                                            }}
                                                          />
                                                          Tags
                                                        </Typography>
                                                        <Divider
                                                          sx={{
                                                            backgroundColor:
                                                              "#f4f4f4",
                                                          }}
                                                        />
                                                        <TextField
                                                          id="outlined-basic"
                                                          label="Search tags"
                                                          variant="outlined"
                                                          value={tagSearch}
                                                          onChange={(e) =>
                                                            setTagSearch(
                                                              e.target.value
                                                            )
                                                          }
                                                          sx={{
                                                            width: "100%",
                                                            fontSize: "10px",
                                                            "& .MuiOutlinedInput-root":
                                                              {
                                                                height: "45px",
                                                                padding: "10px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              },
                                                          }}
                                                        />
                                                        <Divider
                                                          sx={{
                                                            backgroundColor:
                                                              "#f4f4f4",
                                                          }}
                                                        />
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                              "column",
                                                            height: "200px",
                                                            overflowY: "auto",
                                                          }}
                                                        >
                                                          {getTags?.result?.map(
                                                            (tag) => (
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  gap: "5px",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                                key={tag?._id}
                                                              >
                                                                <Checkbox
                                                                  value={
                                                                    tag?._id
                                                                  }
                                                                  checked={
                                                                    !!tagCheckedId[
                                                                      tag._id
                                                                    ]
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) => {
                                                                    const checked =
                                                                      e.target
                                                                        .checked;
                                                                    setTagCheckedId(
                                                                      (
                                                                        prev
                                                                      ) => ({
                                                                        ...prev,
                                                                        [tag._id]:
                                                                          checked,
                                                                      })
                                                                    );
                                                                  }}
                                                                />
                                                                <p>
                                                                  {tag?.name}
                                                                </p>
                                                              </Box>
                                                            )
                                                          )}
                                                        </Box>
                                                        <Divider
                                                          sx={{
                                                            backgroundColor:
                                                              "#f4f4f4",
                                                          }}
                                                        />
                                                        <Button
                                                          variant="contained"
                                                          sx={{
                                                            backgroundColor:
                                                              "#f4f4f4",
                                                            color: "#000",
                                                            textTransform:
                                                              "capitalize",
                                                            "&:hover": {
                                                              backgroundColor:
                                                                "#f4f4f4",
                                                            },
                                                          }}
                                                          onClick={() =>
                                                            setAddTag(false)
                                                          }
                                                        >
                                                          + New tag
                                                        </Button>
                                                        {selectedTagCount >
                                                          0 && (
                                                          <Button
                                                            variant="contained"
                                                            sx={{
                                                              backgroundColor:
                                                                "#ff0000",
                                                              color: "#fff",
                                                              textTransform:
                                                                "capitalize",
                                                              marginTop: "10px",
                                                              "&:hover": {
                                                                backgroundColor:
                                                                  "#ff0000",
                                                              },
                                                            }}
                                                            onClick={
                                                              handleClearTags
                                                            }
                                                          >
                                                            Clear Tags
                                                          </Button>
                                                        )}
                                                      </Box>
                                                    ) : (
                                                      <div className="modal-dialog modal-dialog-centered modal-sm">
                                                        <div className="modal-content">
                                                          <div className="modal-header">
                                                            <h1
                                                              className="modal-title fs-5"
                                                              style={{
                                                                whiteSpace:
                                                                  "nowrap",
                                                                width: "100%",
                                                                fontWeight: 600,
                                                                fontSize:
                                                                  "14px",
                                                                display: "flex",
                                                                alignItems:
                                                                  "center",
                                                              }}
                                                            >
                                                              <ChevronLeft
                                                                onClick={() =>
                                                                  setAddTag(
                                                                    true
                                                                  )
                                                                }
                                                                sx={{
                                                                  color: "#000",
                                                                  cursor:
                                                                    "pointer",
                                                                  fontSize:
                                                                    "20px",
                                                                  marginRight:
                                                                    "10px",
                                                                }}
                                                              />
                                                              New Tag
                                                            </h1>
                                                            <hr />
                                                          </div>
                                                          <div className="modal-body">
                                                            <form>
                                                              <div className="mb-2">
                                                                <input
                                                                  type="text"
                                                                  className="form-control"
                                                                  name="name"
                                                                  placeholder="Tag Name"
                                                                  value={
                                                                    editName
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    setEditName(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                              <div className="color-option mb-3">
                                                                <h5
                                                                  style={{
                                                                    fontWeight: 600,
                                                                    marginBottom:
                                                                      "10px",
                                                                    textAlign:
                                                                      "left",
                                                                  }}
                                                                >
                                                                  Set Color
                                                                </h5>
                                                                <div className="d-flex flex-wrap">
                                                                  {colorPalette.map(
                                                                    (
                                                                      color,
                                                                      index
                                                                    ) => (
                                                                      <Box
                                                                        key={
                                                                          index
                                                                        }
                                                                        sx={{
                                                                          width: 24,
                                                                          height: 24,
                                                                          backgroundColor:
                                                                            color,
                                                                          borderRadius:
                                                                            "50%",
                                                                          margin: 0.5,
                                                                          cursor:
                                                                            "pointer",
                                                                          border:
                                                                            editColor ===
                                                                            color
                                                                              ? "2px solid #000"
                                                                              : "2px solid transparent",
                                                                        }}
                                                                        onClick={() =>
                                                                          setEditColor(
                                                                            color
                                                                          )
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </div>
                                                              </div>
                                                              <div className="d-md-flex justify-content-md-end">
                                                                <button
                                                                  className="btn btn-secondary"
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#000",
                                                                    color:
                                                                      "#fff",
                                                                    display:
                                                                      "flex",
                                                                    alignItems:
                                                                      "center",
                                                                    width:
                                                                      "100px",
                                                                    whiteSpace:
                                                                      "nowrap",
                                                                  }}
                                                                  type="button"
                                                                  onClick={() => {
                                                                    handleCreateTags();
                                                                    setAddTag(
                                                                      true
                                                                    );
                                                                  }}
                                                                >
                                                                  Create Tag
                                                                </button>
                                                              </div>
                                                            </form>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            {/* /btn-group */}
                                            <LocalizationProvider
                                              dateAdapter={AdapterDayjs}
                                            >
                                              <div
                                                className="btn-group mb-2"
                                                style={{
                                                  paddingRight: "5px",
                                                }}
                                              >
                                                <Button
                                                  type="button"
                                                  className={`btn btn-light dropdown-toggle ${
                                                    activeDropdown === "created"
                                                      ? " show"
                                                      : ""
                                                  }`}
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    activeDropdown === "created"
                                                  }
                                                  onClick={(event) => {
                                                    handleDropdownToggle(
                                                      "created"
                                                    );
                                                    setAnchorEl(
                                                      event.currentTarget
                                                    );
                                                  }}
                                                  style={{
                                                    color: "#343a40",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    fontFamily:
                                                      "Nunito, Sans-serif",
                                                    // not in uppercase
                                                    textTransform: "none",
                                                    backgroundColor: "#f3f7f9",
                                                  }}
                                                >
                                                  Created{" "}
                                                  {filters.created ? (
                                                    <>
                                                      (1)
                                                      <span
                                                        style={{
                                                          zIndex: 9999,
                                                        }}
                                                      >
                                                        <FaTimes
                                                          style={{
                                                            color: "#ff0000",
                                                            fontSize: "12px",
                                                            marginLeft: "5px",
                                                          }}
                                                          onClick={
                                                            handleClearFilters
                                                          }
                                                        />
                                                      </span>
                                                    </>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <i className="mdi mdi-chevron-down"></i>
                                                </Button>
                                                <Menu
                                                  anchorEl={anchorEl}
                                                  open={Boolean(anchorEl)}
                                                  onClose={() =>
                                                    setAnchorEl(null)
                                                  }
                                                >
                                                  {createdAtData.map((item) => (
                                                    <MenuItem
                                                      key={item.value}
                                                      onClick={(event) =>
                                                        handleClickChange(
                                                          event,
                                                          item.value
                                                        )
                                                      }
                                                    >
                                                      {item.name}
                                                    </MenuItem>
                                                  ))}
                                                </Menu>

                                                {filters.created ===
                                                  "exactDate" &&
                                                  !filters.creationDate && (
                                                    <DatePicker
                                                      open={pickerOpen}
                                                      // onClose={() =>
                                                      //   setPickerOpen(false)
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChange
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.created ===
                                                  "beforeDate" &&
                                                  !filters.creationDate && (
                                                    <DatePicker
                                                      open={pickerOpen}
                                                      // onClose={() =>
                                                      //   setPickerOpen(false)
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChange
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.created ===
                                                  "afterDate" &&
                                                  !filters.creationDate && (
                                                    <DatePicker
                                                      open={pickerOpen}
                                                      // onClose={() =>
                                                      //   setPickerOpen(false)
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChange
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.created ===
                                                  "customRange" &&
                                                  !filters.creationDate && (
                                                    <DateRange
                                                      dateRange={dateRange}
                                                      setDateRange={
                                                        setDateRange
                                                      }
                                                    />
                                                  )}
                                              </div>
                                            </LocalizationProvider>
                                            {/* /btn-group */}
                                            <LocalizationProvider
                                              dateAdapter={AdapterDayjs}
                                            >
                                              <div
                                                className="btn-group mb-2"
                                                style={{
                                                  paddingRight: "5px",
                                                }}
                                              >
                                                <Button
                                                  type="button"
                                                  className={`btn btn-light dropdown-toggle ${
                                                    activeDropdown === "updated"
                                                      ? " show"
                                                      : ""
                                                  }`}
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    activeDropdown === "updated"
                                                  }
                                                  onClick={(event) => {
                                                    handleDropdownToggle(
                                                      "updated"
                                                    );
                                                    setAnchorElUpdated(
                                                      event.currentTarget
                                                    );
                                                  }}
                                                  style={{
                                                    color: "#343a40",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    fontFamily:
                                                      "Nunito, Sans-serif",
                                                    // not in uppercase
                                                    textTransform: "none",
                                                    backgroundColor: "#f3f7f9",
                                                  }}
                                                >
                                                  Updated{" "}
                                                  {filters.updated ? (
                                                    <>
                                                      (1)
                                                      <span
                                                        style={{
                                                          zIndex: 9999,
                                                        }}
                                                      >
                                                        <FaTimes
                                                          style={{
                                                            color: "#ff0000",
                                                            fontSize: "12px",
                                                            marginLeft: "5px",
                                                          }}
                                                          onClick={
                                                            handleClearFilters
                                                          }
                                                        />
                                                      </span>
                                                    </>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <i className="mdi mdi-chevron-down"></i>
                                                </Button>
                                                <Menu
                                                  anchorEl={anchorElUpdated}
                                                  open={Boolean(
                                                    anchorElUpdated
                                                  )}
                                                  onClose={() =>
                                                    setAnchorElUpdated(null)
                                                  }
                                                >
                                                  {createdAtData.map((item) => (
                                                    <MenuItem
                                                      key={item.value}
                                                      onClick={(event) =>
                                                        handleClickChangeUpdated(
                                                          event,
                                                          item.value
                                                        )
                                                      }
                                                    >
                                                      {item.name}
                                                    </MenuItem>
                                                  ))}
                                                </Menu>

                                                {filters.updated ===
                                                  "exactDate" &&
                                                  !filters.updationDate && (
                                                    <DatePicker
                                                      open={pickerOpenUpdated}
                                                      // onClose={() =>
                                                      //   setPickerOpenUpdated(
                                                      //     false
                                                      //   )
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChangeUpdated
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.updated ===
                                                  "beforeDate" &&
                                                  !filters.updationDate && (
                                                    <DatePicker
                                                      open={pickerOpenUpdated}
                                                      // onClose={() =>
                                                      //   setPickerOpenUpdated(
                                                      //     false
                                                      //   )
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChangeUpdated
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.updated ===
                                                  "afterDate" &&
                                                  !filters.updationDate && (
                                                    <DatePicker
                                                      open={pickerOpenUpdated}
                                                      // onClose={() =>
                                                      //   setPickerOpenUpdated(
                                                      //     false
                                                      //   )
                                                      // }
                                                      value={selectedDate}
                                                      onChange={
                                                        handleDateChangeUpdated
                                                      }
                                                      renderInput={() => null}
                                                      sx={{
                                                        height: "30px",
                                                        // display none .css-1taqjdo-MuiFormControl-root-MuiTextField-root
                                                        // "& .css-1taqjdo-MuiFormControl-root-MuiTextField-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // " & .css-1wa3eu0-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                        // "& .css-bgk865-MuiInputBase-root-MuiOutlinedInput-root":
                                                        //   {
                                                        //     display: "none",
                                                        //   },
                                                      }}
                                                    />
                                                  )}
                                                {filters.updated ===
                                                  "customRange" &&
                                                  !filters.updationDate && (
                                                    <DateRange
                                                      dateRange={dateRange}
                                                      setDateRange={
                                                        setDateRange
                                                      }
                                                    />
                                                  )}
                                              </div>
                                            </LocalizationProvider>
                                            {/* /btn-group */}
                                             <div
                                              className="btn-group mb-2"
                                              style={{ paddingRight: "5px" }}
                                            >
                                            </div> 
                                            <div
                                              className="btn-group mb-2"
                                              style={{ paddingRight: "5px" }}
                                            >
                                              <Button
                                                type="button"
                                                className={`btn btn-light dropdown-toggle ${
                                                  activeDropdown === "sequences"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  activeDropdown === "sequences"
                                                }
                                                onClick={() =>
                                                  handleDropdownToggle(
                                                    "sequences"
                                                  )
                                                }
                                                style={{
                                                  color: "#343a40",
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                  fontFamily:
                                                    "Nunito, Sans-serif",
                                                  // not in uppercase
                                                  textTransform: "none",
                                                  backgroundColor: "#f3f7f9",
                                                }}
                                              >
                                                sequences
                                                {sequences && (
                                                  <>
                                                    {`(${sequences
                                                      .split(",")
                                                      .length.toString()})`}
                                                    <span
                                                      style={{
                                                        zIndex: 9999,
                                                      }}
                                                      onClick={() => {
                                                        setSequences("");
                                                      }}
                                                    >
                                                      <FaTimes
                                                        style={{
                                                          color: "#ff0000",
                                                          fontSize: "12px",
                                                          marginLeft: "5px",
                                                        }}
                                                      />
                                                    </span>
                                                  </>
                                                )}
                                                <i className="mdi mdi-chevron-down"></i>
                                              </Button>
                                              <div
                                                className={`dropdown-menu ${
                                                  activeDropdown === "sequences"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                style={{
                                                  width: "250px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "5px",
                                                    width: "200px",
                                                    padding: "10px",
                                                  }}
                                                >
                                                  <Input
                                                    type="text"
                                                    placeholder="Search"
                                                    startAdornment={
                                                      <InputAdornment position="start">
                                                        <Search />
                                                      </InputAdornment>
                                                    }
                                                    value={searchTemplate}
                                                    onChange={(e) => {
                                                      setSearchTemplate(
                                                        e.target.value
                                                      );
                                                    }}
                                                  />
                                                  {getTemplates?.result
                                                    .filter(
                                                      (item) =>
                                                        !searchTemplate ||
                                                        searchTemplate
                                                          .toLocaleLowerCase()
                                                          .includes(
                                                            item.name.toLocaleLowerCase()
                                                          )
                                                    )
                                                    .map((item) => (
                                                      <MenuItem
                                                        key={item._id}
                                                        onClick={() => {
                                                          setSequences(
                                                            item._id
                                                          );
                                                        }}
                                                      >
                                                        <Book
                                                          style={{
                                                            color: item.color,
                                                            marginRight: "5px",
                                                            width: "20px",
                                                            height: "20px",
                                                          }}
                                                        />
                                                        {item.name}
                                                      </MenuItem>
                                                    ))}
                                                </Box>
                                              </div>
                                            </div>
                                            <div
                                              className="btn-group mb-2"
                                              style={{ paddingRight: "5px" }}
                                            >
                                              <Button
                                                type="button"
                                                className={`btn btn-light dropdown-toggle ${
                                                  activeDropdown ===
                                                  "leadStatus"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  activeDropdown ===
                                                  "leadStatus"
                                                }
                                                onClick={() =>
                                                  handleDropdownToggle(
                                                    "leadStatus"
                                                  )
                                                }
                                                style={{
                                                  color: "#343a40",
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                  fontFamily:
                                                    "Nunito, Sans-serif",
                                                  // not in uppercase
                                                  textTransform: "none",
                                                  backgroundColor: "#f3f7f9",
                                                }}
                                              >
                                                Lead Status
                                                {statusCheckedId.length > 0 && (
                                                  <>
                                                    {`(${statusCheckedId.length})`}
                                                    <span
                                                      style={{
                                                        zIndex: 9999,
                                                      }}
                                                      onClick={() => {
                                                        setStatusCheckedId([]);
                                                      }}
                                                    >
                                                      <FaTimes
                                                        style={{
                                                          color: "#ff0000",
                                                          fontSize: "12px",
                                                          marginLeft: "5px",
                                                        }}
                                                      />
                                                    </span>
                                                  </>
                                                )}
                                                <i className="mdi mdi-chevron-down"></i>
                                              </Button>
                                              <div
                                                className={`dropdown-menu ${
                                                  activeDropdown ===
                                                  "leadStatus"
                                                    ? "show"
                                                    : ""
                                                }`}
                                                style={{
                                                  width: "230px",
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    p: 0,
                                                    backgroundColor: "#fff",
                                                    color: "#000",
                                                    borderRadius: 1,
                                                  }}
                                                >
                                                  <div className="popover__content">
                                                    <div className="leading-states">
                                                      <div className="leading-states-left">
                                                        <h5
                                                          style={{
                                                            whiteSpace:
                                                              "nowrap",
                                                          }}
                                                        >
                                                          <LabelImportant
                                                            style={{
                                                              color: "#000",
                                                              width: "20px",
                                                              height: "20px",
                                                            }}
                                                          />
                                                          Lead Status
                                                        </h5>
                                                      </div>
                                                      <div className="leading-states-right">
                                                        {/* <a >
                                                                    Set Order
                                                                  </a> */}
                                                      </div>
                                                    </div>
                                                    {
                                                      <div className="most-checkboxes">
                                                        {getStatus?.result?.leadsStatuses?.map(
                                                          (option, index) => (
                                                            <div
                                                              className={`form-check mb-2 ${option.color}`}
                                                              key={index}
                                                            >
                                                              <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                // radio
                                                                typeof="checkbox"
                                                                name="flexRadioDefault"
                                                                id={`customradio${
                                                                  index + 1
                                                                }`}
                                                                checked={statusCheckedId?.includes(
                                                                  option._id
                                                                )}
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  const checked =
                                                                    e.target
                                                                      .checked;
                                                                  if (checked) {
                                                                    setStatusCheckedId(
                                                                      [
                                                                        ...statusCheckedId,
                                                                        option._id,
                                                                      ]
                                                                    );
                                                                  } else {
                                                                    setStatusCheckedId(
                                                                      statusCheckedId.filter(
                                                                        (id) =>
                                                                          id !==
                                                                          option._id
                                                                      )
                                                                    );
                                                                  }
                                                                }}
                                                              />
                                                              <label
                                                                className="form-check-label"
                                                                htmlFor={`customradio${
                                                                  index + 1
                                                                }`}
                                                                style={{
                                                                  whiteSpace:
                                                                    "nowrap",
                                                                }}
                                                              >
                                                                <LabelImportant
                                                                  style={{
                                                                    color:
                                                                      option.color,
                                                                    width:
                                                                      "20px",
                                                                    height:
                                                                      "20px",
                                                                    marginRight:
                                                                      "5px",
                                                                  }}
                                                                />
                                                                {option.name}
                                                              </label>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    }
                                                  </div>{" "}
                                                </Box>
                                              </div>
                                            </div>
                                            {/* /btn-group */}
                                            <div
                                              className="btn-group mb-2"
                                              style={{ paddingRight: "5px" }}
                                            >
                                              <button
                                                type="button"
                                                className={`btn btn-light dropdown-toggle ${
                                                  activeDropdownMore
                                                    ? "show"
                                                    : ""
                                                }`}
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                  activeDropdownMore
                                                }
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                                onClick={() =>
                                                  setActiveDropdownMore(true)
                                                }
                                              >
                                                <span>More... </span>
                                                {fields?.length > 0 && (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    {fields?.length}
                                                    <span style={{}}>
                                                      <FaTimes
                                                        style={{
                                                          color: "#ff0000",
                                                          fontSize: "12px",
                                                          marginLeft: "5px",
                                                          marginTop: "-3px",
                                                        }}
                                                        onClick={() => {
                                                          setFields([]);
                                                        }}
                                                      />
                                                    </span>
                                                  </div>
                                                )}
                                                <i className="mdi mdi-chevron-down"></i>
                                              </button>
                                              <div className={`dropdown-menu `}>
                                                <a className="dropdown-item">
                                                  Action
                                                </a>
                                                <a className="dropdown-item">
                                                  Another action
                                                </a>
                                                <a className="dropdown-item">
                                                  Something else here
                                                </a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item">
                                                  Separated link
                                                </a>
                                              </div>
                                            </div>
                                            {/* /btn-group */}
                                          </div>

                                          <div className="col-sm-4">
                                            <div className="text-sm-end mt-2 mt-sm-0">
                                              <div
                                                className="btn-group mb-2"
                                                style={{
                                                  marginRight: "5px",
                                                }}
                                              >
                                                <button
                                                  type="button"
                                                  className={`btn btn-success dropdown-toggle ${
                                                    activeDropdown ===
                                                    "settings"
                                                      ? "show"
                                                      : ""
                                                  }`}
                                                  data-bs-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    activeDropdown ===
                                                    "settings"
                                                  }
                                                  onClick={() =>
                                                    handleDropdownToggle(
                                                      "settings"
                                                    )
                                                  }
                                                >
                                                  Settings{" "}
                                                  <i className="mdi mdi-chevron-down"></i>
                                                </button>
                                                <div
                                                  className={`dropdown-menu ${
                                                    activeDropdown ===
                                                    "settings"
                                                      ? "show"
                                                      : ""
                                                  }`}
                                                  style={{
                                                    marginLeft:
                                                      sort && !isSmallScreen
                                                        ? "-400px"
                                                        : !sort && isSmallScreen
                                                        ? "0px"
                                                        : sort && isSmallScreen
                                                        ? "0px"
                                                        : "-100px",
                                                  }}
                                                >
                                                  {!sortColumn &&
                                                    !sort &&
                                                    activeDropdown ===
                                                      "settings" && (
                                                      <>
                                                        <a
                                                          className="dropdown-item"
                                                          onClick={() =>
                                                            setSortColumn(true)
                                                          }
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "space-between",
                                                            zIndex: 9999,
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          <span>
                                                            <FaChartSimple
                                                              style={{
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />
                                                            Organize Columns
                                                          </span>
                                                          <ChevronRight
                                                            style={{
                                                              marginLeft:
                                                                "auto",
                                                            }}
                                                          />
                                                        </a>
                                                        <a
                                                          className="dropdown-item"
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "space-between",
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={() => {
                                                            setSort(true);
                                                          }}
                                                        >
                                                          <span>
                                                            <FaRetweet
                                                              style={{
                                                                width: "20px",
                                                                height: "20px",
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />{" "}
                                                            Sort Columns
                                                          </span>

                                                          <ChevronRight
                                                            style={{
                                                              marginLeft:
                                                                "auto",
                                                            }}
                                                          />
                                                        </a>

                                                        {/* <a className="dropdown-item">
                                                          <FaEnvelope
                                                            style={{
                                                              width: "20px",
                                                              height: "20px",
                                                              marginRight:
                                                                "10px",
                                                            }}
                                                          />{" "}
                                                          Emails Display
                                                          Settings
                                                        </a>
                                                        <a className="dropdown-item">
                                                          <i className="fa-solid fa-square-phone"></i>{" "}
                                                          Phones Display
                                                          Settings
                                                        </a> */}
                                                      </>
                                                    )}
                                                  {sortColumn && (
                                                    <>
                                                      <Box zIndex={9999}>
                                                        <Typography
                                                          gutterBottom
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            gap: "5px",
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          <ChevronLeft
                                                            onClick={() => {
                                                              setSortColumn(
                                                                false
                                                              );
                                                            }}
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                          />
                                                          Organize Columns
                                                        </Typography>
                                                        <Divider />
                                                        <Box>
                                                          <FormControl
                                                            component="fieldset"
                                                            className="dropdown-item"
                                                            sx={{
                                                              display: "flex",
                                                              flexDirection:
                                                                "column",
                                                              height: "300px",
                                                              overflowY: "auto",
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <FormLabel component="legend">
                                                              Assign column to
                                                              display
                                                            </FormLabel>
                                                            {columnData
                                                              ?.filter(
                                                                (cols) => {
                                                                  return (
                                                                    cols?.name !==
                                                                      "owner" &&
                                                                    cols?.name !==
                                                                      "projects" &&
                                                                    cols?.name !==
                                                                      "created_on" &&
                                                                    cols?.name !==
                                                                      "updated_from_social_on" &&
                                                                    cols?.name !==
                                                                      "created_by"
                                                                  );
                                                                }
                                                              )
                                                              ?.map(
                                                                (column) => (
                                                                  <FormGroup
                                                                    key={
                                                                      column._id
                                                                    }
                                                                    sx={{
                                                                      display:
                                                                        "flex",
                                                                      flexDirection:
                                                                        "column",
                                                                    }}
                                                                  >
                                                                    <FormControlLabel
                                                                      control={
                                                                        <Checkbox
                                                                          checked={
                                                                            column.display
                                                                          }
                                                                          onChange={(
                                                                            e
                                                                          ) =>
                                                                            handleHideAndShowColumns(
                                                                              e,
                                                                              column._id
                                                                            )
                                                                          }
                                                                          name={
                                                                            column.name
                                                                          }
                                                                        />
                                                                      }
                                                                      label={
                                                                        column.name
                                                                          .replace(
                                                                            /_/g,
                                                                            " "
                                                                          )
                                                                          .charAt(
                                                                            0
                                                                          )
                                                                          .toUpperCase() +
                                                                        column.name
                                                                          .replace(
                                                                            /_/g,
                                                                            " "
                                                                          )
                                                                          .slice(
                                                                            1
                                                                          )
                                                                      }
                                                                    />
                                                                  </FormGroup>
                                                                )
                                                              )}
                                                          </FormControl>
                                                        </Box>
                                                      </Box>
                                                    </>
                                                  )}
                                                  {sort && (
                                                    <>
                                                      <SortColumns
                                                        columns={columns}
                                                        setSort={setSort}
                                                        fields={sortField}
                                                        setFields={setSortField}
                                                        handleUpdateColumns={
                                                          handleUpdateColumns
                                                        }
                                                      />
                                                      ;
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                              {/* /btn-group */}
                                              <div className="btn-group mb-2 gap-1">
                                                <button
                                                  type="button"
                                                  className={`btn btn-info dropdown-toggle ${
                                                    activeDropdown === "export"
                                                      ? "show"
                                                      : ""
                                                  }`}
                                                  data-bs-toggle="dropdown"
                                                  aria-haspopup="true"
                                                  aria-expanded={
                                                    activeDropdown === "export"
                                                  }
                                                  onClick={() =>
                                                    setActiveDropdownExport(
                                                      true
                                                    )
                                                  }
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                  }}
                                                >
                                                  <FaDownload />
                                                  Export
                                                </button>
                                                <button
                                                  type="button"
                                                  className="btn btn-info"
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#exportContact"
                                                  onClick={() => {
                                                    setOpenImportDrawer(true);
                                                  }}
                                                >
                                                  <i className="fa-solid fa-download"></i>{" "}
                                                  Import
                                                </button>
                                                </div>
                                               <div className="btn-group mb-2 gap-1">
                                                 <div
                                                   className="btn-group mb-2"
                                                   style={{ paddingRight: "5px" }}
                                                 >
                                                   <button
                                                     type="button"
                                                     className={`btn btn-light dropdown-toggle ${
                                                       activeDropdown === "createdBy" ? "show" : ""
                                                     }`}
                                                     data-bs-toggle="dropdown"
                                                     aria-haspopup="true"
                                                     aria-expanded={activeDropdown === "createdBy"}
                                                     onClick={handleCombinedClick}
                                                   >
                                                     Delete By Files <i className="mdi mdi-chevron-down"></i>
                                                   </button>
                                                   <div
                                                     className={`dropdown-menu ${
                                                       activeDropdown === "createdBy" ? "show" : ""
                                                     }`}
                                                     style={{ width: "250px" }}
                                                   >
                                                     {/* Search Input */}
                                                     <a className="dropdown-item">
                                                       <form className="mb-2 mb-sm-0">
                                                         <label htmlFor="inputPassword2" className="visually-hidden">
                                                           Search
                                                         </label>
                                                         <input
                                                           type="search"
                                                           className="form-control"
                                                           id="inputPassword2"
                                                           placeholder="Delete by File name"
                                                           value={searchQuery}
                                                           onChange={handleSearchChange} 
                                                         />
                                                       </form>
                                                     </a>
                                                     <a className="dropdown-item">
                                                       <div className="form-check mb-2 form-check-success">
                                                         <label className="form-check-label" htmlFor="hamidAli">
                                                         {filteredFiles.map((item, index) => (
                                                              <div key={index}>
                                                                <input
                                                                  className="form-check-input"
                                                                  type="checkbox"
                                                                  value={item.filename} 
                                                                  id={`file-${index}`}
                                                                  onChange={handleFileSelection}
                                                                />
                                                                <label className="form-check-label" htmlFor={`file-${index}`}>
                                                                  {item.filename} - {item.totalFileData} 
                                                               </label>
                                                              </div>
                                                            ))}
                                                          </label>

                                                       </div>
                                                     </a>
                                               
                                                     <button
                                                       type="button"
                                                       className="btn btn-info"
                                                       data-bs-toggle="modal"
                                                       data-bs-target="#exportContact"
                                                       style={{
                                                         backgroundColor: "#ff000d",
                                                         border: "none",
                                                         display: "flex",
                                                         alignItems: "center",
                                                         justifyContent: "flex-end",
                                                       }}
                                                       onClick={handleDeleteFiles}
                                                     >
                                                       <FaTrash
                                                         style={{
                                                           color: "#fff",
                                                           marginTop: "-2px",
                                                         }}
                                                       />
                                                       Delete
                                                     </button>
                                                   </div>
                                                 </div>
                                               
                                                 {/* Delete Imported Leads Button */}
                                                 <button
                                                   type="button"
                                                   className="btn btn-info"
                                                   data-bs-toggle="modal"
                                                   data-bs-target="#exportContact"
                                                   onClick={() => {
                                                     setOpenImportDeleted(true);
                                                   }}
                                                   style={{
                                                     backgroundColor: "#ff000d",
                                                     border: "none",
                                                     display: "flex",
                                                     alignItems: "center",
                                                     justifyContent: "flex-end",
                                                   }}
                                                 >
                                                   <FaTrash
                                                     style={{
                                                       color: "#fff",
                                                       marginTop: "-2px",
                                                     }}
                                                   />
                                                   Delete Import Leads
                                                 </button>
                                               </div>
                                               </div>
                                              {/* /btn-group */}
                                          </div>
                                          {/* <!-- end col--> */}
                                        </div>
                                      </ClickAwayListener>
                                    )}
                                    <div className="table-responsive">
                                      <ClickAwayListener
                                        onClickAway={() => {
                                          setActiveDropdownTable("");
                                          setOpenToolTipId("");
                                          setOpenToolTipColumn("");
                                        }}
                                      >
                                        <Table
                                          className="table table-centered  "
                                          id="products-datatable"
                                          sx={{
                                            minWidth: 650,
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <TableHead>
                                            <TableRow
                                              style={{
                                                backgroundColor: "#fff",
                                              }}
                                            >
                                              <TableCell
                                                style={{ width: "20px" }}
                                              >
                                                <div className="form-check">
                                                  <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="customCheck1"
                                                    checked={
                                                      selectedProfiles.length !==
                                                        0 &&
                                                      selectedProfiles.length ===
                                                        getProfiles?.result
                                                          ?.allLeads?.length
                                                    }
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        setSelectedProfiles(
                                                          getProfiles?.result?.allLeads.map(
                                                            (profile) =>
                                                              profile._id
                                                          )
                                                        );
                                                        setSelectedTagIds([
                                                          ...selectedTagIds,
                                                          ...new Set(
                                                            getProfiles?.result?.allLeads.map(
                                                              (profile) =>
                                                                profile.tags?.map(
                                                                  (tag) =>
                                                                    tag._id
                                                                )
                                                            )
                                                          ),
                                                        ]);
                                                      } else {
                                                        setSelectedProfiles([]);
                                                      }
                                                    }}
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    for="customCheck1"
                                                  >
                                                    &nbsp;
                                                  </label>
                                                </div>
                                              </TableCell>
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "profile" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "profile"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "profile"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "profile"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Profile
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "profile"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <FaEyeSlash
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />
                                                            <span>
                                                              Hide Column{" "}
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "company" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "company"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "company"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "company"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Company
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "company"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() => {
                                                              setFields([
                                                                ...fields,
                                                                {
                                                                  name: "company",
                                                                  operator:
                                                                    "is",
                                                                  value: "",
                                                                },
                                                              ]);
                                                              setActiveDropdownMore(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Filter by company
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "emails" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "email"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "email"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "email"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Email
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "email"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a className="dropdown-item notify-item">
                                                              <span>
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Direct
                                                              </span>
                                                            </a>
                                                            <a className="dropdown-item notify-item">
                                                              <span>
                                                                {" "}
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Work
                                                              </span>
                                                            </a>
                                                            <a className="dropdown-item notify-item">
                                                              <span>
                                                                {" "}
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Include
                                                                unverified
                                                                emails
                                                              </span>
                                                            </a> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <span>
                                                              {" "}
                                                              <i className="fa-regular fa-square-check"></i>{" "}
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "lead_status" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "lead"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "lead"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "lead"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Lead Status{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "lead"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() => {
                                                              setFields([
                                                                ...fields,
                                                                {
                                                                  name: "leadStatus",
                                                                  operator:
                                                                    "is",
                                                                  value: "",
                                                                },
                                                              ]);
                                                              setActiveDropdownMore(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            <FaFilter
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />
                                                            <span>
                                                              FIlter By Lead
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          <a
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                            className="dropdown-item notify-item"
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "phones" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "phone"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "phone"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "phone"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Phone
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "phone"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a className="dropdown-item notify-item">
                                                              <span>
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Direct
                                                              </span>
                                                            </a>
                                                           <a className="dropdown-item notify-item">
                                                              <span>
                                                                {" "}
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Work
                                                              </span>
                                                            </a>
                                                            <a className="dropdown-item notify-item">
                                                              <span>
                                                                {" "}
                                                                <i className="fa-regular fa-square-check"></i>{" "}
                                                                Include
                                                                unverified
                                                                emails
                                                              </span>
                                                            </a> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <span>
                                                              {" "}
                                                              <i className="fa-regular fa-square-check"></i>{" "}
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "assignedTo" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "assign"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "assign"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "assign"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Assigned To
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "assign"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() => {
                                                              setFields([
                                                                ...fields,
                                                                {
                                                                  name: "assignTo",
                                                                  operator:
                                                                    "is",
                                                                  value: "",
                                                                },
                                                              ]);
                                                              setActiveDropdownMore(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            <FaFilter
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />
                                                            <span>
                                                              Filter by assign
                                                              to
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "tags" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "tag"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "tag"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "tag"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Tag{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "tag"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() => {
                                                              setFields([
                                                                ...fields,
                                                                {
                                                                  name: "tag",
                                                                  operator:
                                                                    "is",
                                                                  value: "",
                                                                },
                                                              ]);
                                                              setActiveDropdownMore(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            <FaFilter
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />

                                                            <span>
                                                              FIlter by Tags
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "notes" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "notes"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "notes"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "notes"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Notes{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "notes"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "createdAt" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "creation"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "creation"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "creation"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Created{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "creation"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() => {
                                                              setFields([
                                                                ...fields,
                                                                {
                                                                  name: "created",
                                                                  operator:
                                                                    "is",
                                                                  value: "",
                                                                },
                                                              ]);
                                                              setActiveDropdownMore(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            <FaFilter
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                            />
                                                            <span>
                                                              Filter by create
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "updatedFromLinkedin" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "linkedin"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "linkedin"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "linkedin"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Updated from linkedin{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "linkedin"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "skills" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "skill"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "skill"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "skill"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Skills{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "skill"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "education_info" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "education"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "education"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "education"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Education{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "education"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item" onClick={() =>
                                                                handleHideColumn(
                                                                  column
                                                                )
                                                              }
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                Hide Column
                                                              </span>
                                                            </a> */}
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "current_job_experience" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "position"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "position"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "position"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Current position{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "position"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}

                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "past_job_experience" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "createdby"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "createdby"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "createdby"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Past Position{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "createdby"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name ===
                                                    "created_by" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "country"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "country"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "country"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Created by{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "country"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "country" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "country2"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "country2"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "country2"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          Country{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "country2"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "city" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "city"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "city"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "city"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          City{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          div
                                                          className={`dropdown-menu user-pro-dropdown ${
                                                            activeDropdownTable ===
                                                            "city"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                              {columnData?.map((column) => {
                                                if (
                                                  column?.name === "state" &&
                                                  column?.display === true
                                                )
                                                  return (
                                                    <TableCell>
                                                      <div className="dropdown">
                                                        <a
                                                          className={`dropdown-toggle h5 mb-1 d-block ${
                                                            activeDropdownTable ===
                                                            "state"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          data-bs-toggle="dropdown"
                                                          aria-expanded={
                                                            activeDropdownTable ===
                                                            "state"
                                                          }
                                                          onClick={() =>
                                                            handleDropdownToggle(
                                                              "state"
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          State{" "}
                                                          <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </a>
                                                        <div
                                                          className={`dropdown-menu  ${
                                                            activeDropdownTable ===
                                                            "state"
                                                              ? "show"
                                                              : ""
                                                          }`}
                                                          style={{
                                                            marginLeft: "-50px",
                                                          }}
                                                        >
                                                          {/* <!-- item--> */}
                                                          {/* <a
                                                              
                                                              className="dropdown-item notify-item"
                                                            >
                                                              <i className="fe-user me-1"></i>
                                                              <span>
                                                                user-pro-dropdown
                                                              </span>
                                                            </a> */}
                                                          {/* <!-- item--> */}
                                                          <a
                                                            className="dropdown-item notify-item"
                                                            onClick={() =>
                                                              handleHideColumn(
                                                                column
                                                              )
                                                            }
                                                          >
                                                            <i className="fe-user me-1"></i>
                                                            <span>
                                                              Hide Column
                                                            </span>
                                                          </a>
                                                        </div>
                                                      </div>
                                                    </TableCell>
                                                  );
                                              })}
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {(!isLoading ||
                                              !isFetchingProfiles) &&
                                              getProfiles?.result?.allLeads
                                                ?.length > 0 &&
                                              getProfiles?.result?.allLeads?.map(
                                                (profile, index) => {
                                                  // give me (month date, year time) from created_at
                                                  const date = new Date(
                                                    profile?.created_at
                                                  );
                                                  const formattedDate = `${date.toLocaleString(
                                                    "default",
                                                    { month: "short" }
                                                  )} ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
                                                  return (
                                                    <TableRow
                                                      key={profile._id}
                                                      sx={{
                                                        backgroundColor:
                                                          index % 2 === 0
                                                            ? "#f3f7f9"
                                                            : "inherit",
                                                      }}
                                                    >
                                                      <TableCell
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      >
                                                        <div className="form-check">
                                                          <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id="customCheck2"
                                                            checked={selectedProfiles.includes(
                                                              profile._id
                                                            )}
                                                            onChange={(e) => {
                                                              handleSelectProfile(
                                                                e,
                                                                profile
                                                              );
                                                            }}
                                                          />
                                                          <label
                                                            className="form-check-label"
                                                            for="customCheck2"
                                                          >
                                                            &nbsp;
                                                          </label>
                                                        </div>
                                                      </TableCell>
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "company" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  // }
                                                                  title={
                                                                    <div className="popover__content">
                                                                      <div className="comapy-detail">
                                                                        <div className="company-top-deal">
                                                                          <div className="company-detail-left">
                                                                            <img
                                                                              src={
                                                                                profile
                                                                                  ?.currentPositions[0]
                                                                                  ?.imageSrc &&
                                                                                profile
                                                                                  ?.currentPositions[0]
                                                                                  ?.imageSrc !==
                                                                                  "https://www.undefined"
                                                                                  ? profile
                                                                                      ?.currentPositions[0]
                                                                                      ?.imageSrc
                                                                                  : "/assets/images/logocom.png"
                                                                              }
                                                                              style={{
                                                                                width:
                                                                                  "30px",
                                                                                height:
                                                                                  "30px",
                                                                                borderRadius:
                                                                                  "50%",
                                                                              }}
                                                                            />
                                                                          </div>
                                                                          <div className="company-detail-right">
                                                                            <p>
                                                                              {
                                                                                profile
                                                                                  ?.currentPositions[0]
                                                                                  ?.company
                                                                              }
                                                                            </p>
                                                                            <span
                                                                              style={{
                                                                                color:
                                                                                  "rgb(108 117 125)",
                                                                              }}
                                                                            >
                                                                              {
                                                                                profile
                                                                                  ?.company
                                                                                  ?.companySize
                                                                              }
                                                                            </span>
                                                                          </div>
                                                                        </div>
                                                                      </div>

                                                                      <div
                                                                        className="company-btm-deal"
                                                                        style={{
                                                                          color:
                                                                            "rgb(108 117 125)",
                                                                        }}
                                                                      >
                                                                        {(profile
                                                                          ?.company
                                                                          ?.founded ||
                                                                          profile
                                                                            ?.company
                                                                            ?.companyLocation) && (
                                                                          <ul>
                                                                            <li>
                                                                              Founded{" "}
                                                                              <span>
                                                                                {
                                                                                  profile
                                                                                    ?.company
                                                                                    ?.founded
                                                                                }
                                                                              </span>
                                                                            </li>
                                                                            <li>
                                                                              Location{" "}
                                                                              <span>
                                                                                {
                                                                                  profile
                                                                                    ?.company
                                                                                    ?.companyLocation
                                                                                }
                                                                              </span>
                                                                            </li>
                                                                            {/* <li>
                                                              Social Media{" "}
                                                              <a >
                                                                <FaLinkedin
                                                                  style={{
                                                                    color:
                                                                      "#0077b5",
                                                                    width:
                                                                      "15px",
                                                                    height:
                                                                      "15px",
                                                                  }}
                                                                />
                                                              </a>
                                                            </li> */}
                                                                          </ul>
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  }
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                -14,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  <a
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#company-modal"
                                                                    onClick={() => {
                                                                      isSmallScreen
                                                                        ? handleOpenSmallScreenModal(
                                                                            column,
                                                                            profile
                                                                          )
                                                                        : undefined;
                                                                    }}
                                                                  >
                                                                    <div className="company-detail">
                                                                      <div className="company-detail-left">
                                                                        <img
                                                                          src={
                                                                            profile
                                                                              ?.company
                                                                              ?.imageSrc &&
                                                                            profile?.imageUrl !==
                                                                              "https://www.undefined"
                                                                              ? profile
                                                                                  ?.company
                                                                                  ?.imageSrc
                                                                              : "/assets/images/logocom.png"
                                                                          }
                                                                          style={{
                                                                            width:
                                                                              "30px",
                                                                            height:
                                                                              "30px",
                                                                            borderRadius:
                                                                              "50%",
                                                                          }}
                                                                        />
                                                                      </div>
                                                                      <div className="company-detail-right">
                                                                        <p>
                                                                          {profile
                                                                            ?.company
                                                                            ?.company
                                                                            ? profile?.company?.company?.slice(
                                                                                0,
                                                                                20
                                                                              ) +
                                                                              "..."
                                                                            : "..."}
                                                                        </p>
                                                                        <span
                                                                          style={{
                                                                            color:
                                                                              "rgb(108 117 125)",
                                                                          }}
                                                                        >
                                                                          {
                                                                            profile
                                                                              ?.company
                                                                              ?.companySize
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  </a>
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "emails" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                {profile?.emails
                                                                  .length >
                                                                0 ? (
                                                                  <Tooltip
                                                                    open={
                                                                      (isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name) ||
                                                                      (!isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name)
                                                                    }
                                                                    onMouseEnter={
                                                                      !isSmallScreen
                                                                        ? () =>
                                                                            handleOpenTooltip(
                                                                              column?.name,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                    // onMouseLeave={
                                                                    //   !isSmallScreen
                                                                    //     ? () =>
                                                                    //         handleOpenTooltip(
                                                                    //           column?.name,
                                                                    //           profile
                                                                    //         )
                                                                    //     : undefined
                                                                    // }
                                                                    title={
                                                                      <>
                                                                        <div
                                                                          className=""
                                                                          style={{
                                                                            padding:
                                                                              "10px 7px 10px 7px",
                                                                          }}
                                                                        >
                                                                          <div className="adnra-mail">
                                                                            <div className="adnra-mail-left">
                                                                              <h5
                                                                                style={{
                                                                                  display:
                                                                                    "flex",
                                                                                  gap: "10px",
                                                                                  alignItems:
                                                                                    "center",
                                                                                  fontSize:
                                                                                    "14px",
                                                                                  width:
                                                                                    "160px",
                                                                                }}
                                                                              >
                                                                                <FaEnvelope
                                                                                  style={{
                                                                                    color:
                                                                                      "#000",
                                                                                    width:
                                                                                      "30px",
                                                                                    height:
                                                                                      "30px",
                                                                                  }}
                                                                                />
                                                                                {
                                                                                  profile?.name
                                                                                }
                                                                                's'
                                                                                Emails
                                                                              </h5>
                                                                            </div>
                                                                            <div className="adnra-mail-right">
                                                                              <a
                                                                                style={{
                                                                                  color:
                                                                                    "#0077b5",
                                                                                  fontSize:
                                                                                    "14px",
                                                                                  fontWeight:
                                                                                    "600",
                                                                                  cursor:
                                                                                    "pointer",
                                                                                }}
                                                                                onClick={() => {
                                                                                  setOpenEditPopOverDrawer(
                                                                                    true
                                                                                  );
                                                                                  setInputField(
                                                                                    profile?.emails?.map(
                                                                                      (
                                                                                        email
                                                                                      ) => {
                                                                                        return {
                                                                                          email:
                                                                                            email.email,
                                                                                        };
                                                                                      }
                                                                                    )
                                                                                  );
                                                                                  setEditedEmailFieldLeadId(
                                                                                    profile._id
                                                                                  );
                                                                                }}
                                                                              >
                                                                                Edit
                                                                                emails
                                                                              </a>
                                                                            </div>
                                                                          </div>
                                                                          <div className="most-likely">
                                                                            <p>
                                                                              MOST
                                                                              LIKELY
                                                                            </p>{" "}
                                                                            {profile?.emails?.map(
                                                                              (
                                                                                email,
                                                                                index
                                                                              ) => (
                                                                                <div className="most-likely-mail">
                                                                                  <div
                                                                                    className="most-likely-left"
                                                                                    style={{
                                                                                      display:
                                                                                        "flex",
                                                                                      gap: "5px",
                                                                                      alignItems:
                                                                                        "center",
                                                                                    }}
                                                                                  >
                                                                                    <span>
                                                                                      {email.validationStatus ===
                                                                                        1 ||
                                                                                      email.validationStatus ===
                                                                                        2 ? (
                                                                                        <Verified
                                                                                          sx={{
                                                                                            marginTop:
                                                                                              "-5px",

                                                                                            fontSize:
                                                                                              "18px",
                                                                                            color:
                                                                                              email.validationStatus ===
                                                                                              1
                                                                                                ? "yellowgreen"
                                                                                                : email.validationStatus ===
                                                                                                  2
                                                                                                ? "#69B3FF"
                                                                                                : "",
                                                                                          }}
                                                                                        />
                                                                                      ) : (
                                                                                        <PriorityHighOutlined
                                                                                          sx={{
                                                                                            marginTop:
                                                                                              "-5px",
                                                                                            fontSize:
                                                                                              "18px",
                                                                                            color:
                                                                                              "red",
                                                                                          }}
                                                                                        />
                                                                                      )}
                                                                                    </span>
                                                                                    <p
                                                                                      style={{
                                                                                        fontSize:
                                                                                          "14px",
                                                                                        width:
                                                                                          "160px",
                                                                                        lineHeight:
                                                                                          "1",
                                                                                      }}
                                                                                    >
                                                                                      {
                                                                                        email?.email
                                                                                      }
                                                                                    </p>
                                                                                  </div>
                                                                                  <div className="most-likely-right badge">
                                                                                    <p
                                                                                      style={{
                                                                                        display:
                                                                                          "flex",
                                                                                        gap: "5px",
                                                                                        alignItems:
                                                                                          "center",
                                                                                      }}
                                                                                    >
                                                                                      <span
                                                                                        style={{
                                                                                          backgroundColor:
                                                                                            "#38414a",
                                                                                          padding:
                                                                                            "5px 0px",
                                                                                          fontSize:
                                                                                            "12px",
                                                                                          color:
                                                                                            "#fff",
                                                                                          borderRadius:
                                                                                            "5px",
                                                                                          width:
                                                                                            "50px",
                                                                                          textAlign:
                                                                                            "center",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          email?.type
                                                                                        }
                                                                                      </span>{" "}
                                                                                      {copied &&
                                                                                      copiedEmail ===
                                                                                        email.email ? (
                                                                                        <FaCheckCircle
                                                                                          style={{
                                                                                            color:
                                                                                              "green",
                                                                                            width:
                                                                                              "15px",
                                                                                            height:
                                                                                              "15px",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                        />
                                                                                      ) : (
                                                                                        <FaCopy
                                                                                          style={{
                                                                                            color:
                                                                                              "gray",
                                                                                            width:
                                                                                              "15px",
                                                                                            height:
                                                                                              "15px",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                          }}
                                                                                          onClick={(
                                                                                            e
                                                                                          ) => {
                                                                                            setInputField(
                                                                                              [
                                                                                                {
                                                                                                  email:
                                                                                                    email.email,
                                                                                                },
                                                                                              ]
                                                                                            );
                                                                                            handleCopy(
                                                                                              e,
                                                                                              email
                                                                                            );
                                                                                          }}
                                                                                        />
                                                                                      )}
                                                                                      {/* <FaEnvelope
                                                                                        style={{
                                                                                          color:
                                                                                            "gray",
                                                                                          width:
                                                                                            "15px",
                                                                                          height:
                                                                                            "15px",
                                                                                          cursor:
                                                                                            "pointer",
                                                                                        }}
                                                                                        onClick={() => {
                                                                                          setOpenTemplate(
                                                                                            true
                                                                                          );
                                                                                          setEditTemplateEmail(
                                                                                            email.email
                                                                                          );
                                                                                          setEditTemplateName(
                                                                                            profile
                                                                                              ?.template
                                                                                              ?.name
                                                                                          );
                                                                                          setEditTemplateId(
                                                                                            profile
                                                                                              ?.template
                                                                                              ?._id
                                                                                          );
                                                                                          setEditTemplateLeadId(
                                                                                            profile?._id
                                                                                          );
                                                                                        }}
                                                                                      /> */}
                                                                                    </p>
                                                                                  </div>{" "}
                                                                                </div>
                                                                              )
                                                                            )}
                                                                          </div>
                                                                        </div>
                                                                      </>
                                                                    }
                                                                    disableFocusListener
                                                                    disableHoverListener={
                                                                      isSmallScreen
                                                                    }
                                                                    disableTouchListener={
                                                                      isSmallScreen
                                                                    }
                                                                    placement="bottom-start"
                                                                    arrow
                                                                    PopperProps={{
                                                                      modifiers:
                                                                        [
                                                                          {
                                                                            name: "offset",
                                                                            options:
                                                                              {
                                                                                offset:
                                                                                  [
                                                                                    0,
                                                                                    -14,
                                                                                  ],
                                                                              },
                                                                          },
                                                                        ],
                                                                      sx: {
                                                                        "& .MuiTooltip-tooltip":
                                                                          {
                                                                            backgroundColor:
                                                                              "#fff",
                                                                            color:
                                                                              "white",
                                                                            boxShadow:
                                                                              "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                          },
                                                                        "& .MuiTooltip-arrow":
                                                                          {
                                                                            color:
                                                                              "#f4f4f4",
                                                                          },
                                                                      },
                                                                    }}
                                                                  >
                                                                    <a
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#standard-modal"
                                                                      id={
                                                                        popOverEl
                                                                      }
                                                                      onMouseEnter={(
                                                                        e
                                                                      ) => {
                                                                        setPopOverEl(
                                                                          e.currentTarget
                                                                        );
                                                                      }}
                                                                    >
                                                                      <div
                                                                        className="email-detail"
                                                                        onClick={
                                                                          isSmallScreen
                                                                            ? () =>
                                                                                handleOpenSmallScreenModal(
                                                                                  column,
                                                                                  profile
                                                                                )
                                                                            : undefined
                                                                        }
                                                                      >
                                                                        <p
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                          }}
                                                                        >
                                                                          {profile?.emailsStatus ===
                                                                          "sequenceAssigned" ? (
                                                                            <FaMailBulk
                                                                              style={{
                                                                                color:
                                                                                  "#3284FF",
                                                                                width:
                                                                                  "15px",
                                                                                height:
                                                                                  "15px",
                                                                              }}
                                                                            />
                                                                          ) : profile?.emailsStatus ===
                                                                            "notSent" ? (
                                                                            <FaEnvelopeCircleCheck
                                                                              style={{
                                                                                color:
                                                                                  "#DB8503",
                                                                                width:
                                                                                  "15px",

                                                                                height:
                                                                                  "15px",
                                                                              }}
                                                                            />
                                                                          ) : profile?.emailsStatus ===
                                                                            "singleSent" ? (
                                                                            <FaEnvelopeOpenText
                                                                              style={{
                                                                                color:
                                                                                  "#01c300db",
                                                                                width:
                                                                                  "15px",
                                                                                height:
                                                                                  "15px",
                                                                              }}
                                                                            />
                                                                          ) : profile?.emailsStatus ===
                                                                            "allSequencesDeleted" ? (
                                                                            <FaEnvelopeOpenText
                                                                              style={{
                                                                                color:
                                                                                  "#FF6471",
                                                                                width:
                                                                                  "15px",
                                                                                height:
                                                                                  "15px",
                                                                              }}
                                                                            />
                                                                          ) : (
                                                                            <FaEnvelopeCircleCheck
                                                                              style={{
                                                                                color:
                                                                                  "#DB8503",
                                                                                width:
                                                                                  "15px",
                                                                                height:
                                                                                  "15px",
                                                                              }}
                                                                            />
                                                                          )}
                                                                          {
                                                                            profile
                                                                              ?.emails[0]
                                                                              ?.email
                                                                          }
                                                                        </p>
                                                                        <span>
                                                                          {profile
                                                                            ?.emails
                                                                            .length >
                                                                          1
                                                                            ? "+" +
                                                                              (profile
                                                                                ?.emails
                                                                                ?.length -
                                                                                1) +
                                                                              " More"
                                                                            : ""}{" "}
                                                                        </span>

                                                                        <span></span>
                                                                      </div>
                                                                    </a>{" "}
                                                                  </Tooltip>
                                                                ) : (
                                                                  "---"
                                                                )}
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "lead_status" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  // }
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  title={
                                                                    <div className="popover__content">
                                                                      <div className="leading-states">
                                                                        <div className="leading-states-left">
                                                                          <h5>
                                                                            <FaAddressCard
                                                                              style={{
                                                                                color:
                                                                                  "#000",
                                                                                width:
                                                                                  "20px",
                                                                                height:
                                                                                  "20px",
                                                                              }}
                                                                            />
                                                                            Lead
                                                                            Status
                                                                          </h5>
                                                                        </div>
                                                                        <div className="leading-states-right">
                                                                          {/* <a >
                                                                    Set Order
                                                                  </a> */}
                                                                        </div>
                                                                      </div>
                                                                      <div className="most-checkboxes">
                                                                        <Scrollbar
                                                                          style={{
                                                                            height:
                                                                              "200px",
                                                                            width:
                                                                              "200px",
                                                                          }}
                                                                        >
                                                                          {getStatus?.result?.leadsStatuses?.map(
                                                                            (
                                                                              option,
                                                                              index
                                                                            ) => (
                                                                              <div
                                                                                className={`form-check mb-2 ${option.color}`}
                                                                                key={
                                                                                  index
                                                                                }
                                                                                onClick={(
                                                                                  e
                                                                                ) => {
                                                                                  e.preventDefault();
                                                                                }}
                                                                              >
                                                                                <input
                                                                                  className="form-check-input"
                                                                                  type="radio"
                                                                                  style={{
                                                                                    cursor:
                                                                                      "pointer",
                                                                                  }}
                                                                                  // radio
                                                                                  typeof="radio"
                                                                                  name={`flexRadioDefault-${profile._id}`}
                                                                                  id={`customradio${
                                                                                    index +
                                                                                    1
                                                                                  }`}
                                                                                  value={
                                                                                    option._id
                                                                                  }
                                                                                  checked={
                                                                                    selectedLeadStatusId[
                                                                                      profile
                                                                                        ._id
                                                                                    ] ===
                                                                                      profile._id ||
                                                                                    profile
                                                                                      ?.status
                                                                                      ?._id ===
                                                                                      option._id
                                                                                  }
                                                                                  onChange={(
                                                                                    e
                                                                                  ) => {
                                                                                    handleChange(
                                                                                      e,
                                                                                      profile
                                                                                    );
                                                                                  }}
                                                                                />
                                                                                <label
                                                                                  className="form-check-label"
                                                                                  htmlFor={`customradio${
                                                                                    index +
                                                                                    1
                                                                                  }`}
                                                                                >
                                                                                  <LabelImportant
                                                                                    style={{
                                                                                      color:
                                                                                        option.color,
                                                                                      width:
                                                                                        "20px",
                                                                                      height:
                                                                                        "20px",
                                                                                      marginRight:
                                                                                        "5px",
                                                                                    }}
                                                                                  />
                                                                                  {
                                                                                    option.name
                                                                                  }
                                                                                </label>
                                                                              </div>
                                                                            )
                                                                          )}
                                                                        </Scrollbar>
                                                                      </div>
                                                                    </div>
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                -14,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  {profile?.status ? (
                                                                    <a
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#lead-modal"
                                                                    >
                                                                      <div
                                                                        className=" "
                                                                        style={{
                                                                          backgroundColor:
                                                                            "white",
                                                                          border:
                                                                            "1px solid #e0e0e0",
                                                                          padding:
                                                                            "5px 5px",
                                                                          borderRadius:
                                                                            "30px",
                                                                        }}
                                                                        onClick={() => {
                                                                          isSmallScreen
                                                                            ? handleOpenSmallScreenModal(
                                                                                column,
                                                                                profile
                                                                              )
                                                                            : undefined;
                                                                        }}
                                                                      >
                                                                        <h6
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                            fontSize:
                                                                              "14px",
                                                                            width:
                                                                              "100%",
                                                                          }}
                                                                        >
                                                                          <LabelImportant
                                                                            style={{
                                                                              color:
                                                                                profile
                                                                                  ?.status
                                                                                  ?.color,
                                                                              width:
                                                                                "20px",
                                                                              height:
                                                                                "20px",
                                                                            }}
                                                                          />
                                                                          {
                                                                            profile
                                                                              ?.status
                                                                              ?.name
                                                                          }
                                                                        </h6>
                                                                      </div>
                                                                    </a>
                                                                  ) : (
                                                                    <a
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#lead-modal"
                                                                    >
                                                                      <div
                                                                        className="added-by "
                                                                        onClick={() => {
                                                                          isSmallScreen
                                                                            ? handleOpenSmallScreenModal(
                                                                                column,
                                                                                profile
                                                                              )
                                                                            : undefined;
                                                                        }}
                                                                      >
                                                                        <h6
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                            fontSize:
                                                                              "14px",
                                                                          }}
                                                                        >
                                                                          <LabelImportant
                                                                            style={{
                                                                              color:
                                                                                profile
                                                                                  ?.status
                                                                                  ?.color,
                                                                              width:
                                                                                "20px",
                                                                              height:
                                                                                "20px",
                                                                            }}
                                                                          />
                                                                          Add
                                                                          Status
                                                                        </h6>
                                                                      </div>
                                                                    </a>
                                                                  )}
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "phones" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                {profile?.phones &&
                                                                profile?.phones
                                                                  ?.length >
                                                                  0 ? (
                                                                  <Tooltip
                                                                    open={
                                                                      (isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name) ||
                                                                      (!isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name)
                                                                    }
                                                                    onMouseEnter={
                                                                      !isSmallScreen
                                                                        ? () =>
                                                                            handleOpenTooltip(
                                                                              column?.name,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                    // onMouseLeave={
                                                                    //   !isSmallScreen
                                                                    //     ? () =>
                                                                    //         handleOpenTooltip(
                                                                    //           column?.name,
                                                                    //           profile
                                                                    //         )
                                                                    //     : undefined
                                                                    // }
                                                                    disableFocusListener
                                                                    disableHoverListener={
                                                                      isSmallScreen
                                                                    }
                                                                    disableTouchListener={
                                                                      isSmallScreen
                                                                    }
                                                                    title={
                                                                      <div
                                                                        className="popover__content"
                                                                        style={{
                                                                          width:
                                                                            "320px",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                          borderRadius:
                                                                            "10px",
                                                                        }}
                                                                      >
                                                                        <div className="adnra-mail-left">
                                                                          <h5
                                                                            style={{
                                                                              display:
                                                                                "flex",
                                                                              gap: "10px",
                                                                              alignItems:
                                                                                "center",
                                                                              fontSize:
                                                                                "14px",
                                                                              width:
                                                                                "160px",
                                                                            }}
                                                                          >
                                                                            {" "}
                                                                            <FaMobileScreen
                                                                              style={{
                                                                                color:
                                                                                  "#000",
                                                                                width:
                                                                                  "20px",
                                                                                height:
                                                                                  "20px",
                                                                              }}
                                                                            />
                                                                            {
                                                                              profile?.name
                                                                            }
                                                                            's
                                                                            Phones
                                                                          </h5>
                                                                        </div>{" "}
                                                                        {profile?.phones?.map(
                                                                          (
                                                                            phone
                                                                          ) => (
                                                                            <div
                                                                              className="most-likely-mail"
                                                                              style={{
                                                                                display:
                                                                                  "flex",
                                                                                alignItems:
                                                                                  "center",
                                                                                marginBottom:
                                                                                  "-20px",
                                                                                justifyContent:
                                                                                  "space-between",
                                                                              }}
                                                                            >
                                                                              <div
                                                                                className="most-likely-left"
                                                                                style={{
                                                                                  display:
                                                                                    "flex",
                                                                                  gap: "5px",
                                                                                  alignItems:
                                                                                    "center",
                                                                                  whiteSpace:
                                                                                    "nowrap",
                                                                                  width:
                                                                                    "300px",
                                                                                }}
                                                                              >
                                                                                <span>
                                                                                  <Verified
                                                                                    sx={{
                                                                                      marginTop:
                                                                                        "10px",
                                                                                      fontSize:
                                                                                        "18px",
                                                                                      color:
                                                                                        phone?.type ===
                                                                                        "Direct"
                                                                                          ? "yellowgreen"
                                                                                          : "#69B3FF",
                                                                                    }}
                                                                                  />
                                                                                </span>

                                                                                <p>
                                                                                  {
                                                                                    phone?.phone
                                                                                  }
                                                                                </p>
                                                                              </div>
                                                                              <div
                                                                                className="badge"
                                                                                style={{
                                                                                  marginTop:
                                                                                    "10px",
                                                                                }}
                                                                              >
                                                                                <p
                                                                                  style={{
                                                                                    display:
                                                                                      "flex",
                                                                                    gap: "5px",
                                                                                    alignItems:
                                                                                      "center",
                                                                                    whiteSpace:
                                                                                      "nowrap",
                                                                                  }}
                                                                                >
                                                                                  <div
                                                                                    style={{
                                                                                      display:
                                                                                        "flex",
                                                                                      flexDirection:
                                                                                        "column",
                                                                                      gap: "2px",
                                                                                    }}
                                                                                  >
                                                                                    {phone?.type ===
                                                                                      "Work" &&
                                                                                      phone?.country && (
                                                                                        <span
                                                                                          style={{
                                                                                            backgroundColor:
                                                                                              "#69B3FF",
                                                                                            padding:
                                                                                              "5px 5px",
                                                                                            fontSize:
                                                                                              "10px",
                                                                                            borderRadius:
                                                                                              "10px",
                                                                                          }}
                                                                                        >
                                                                                          {
                                                                                            phone?.country
                                                                                          }
                                                                                        </span>
                                                                                      )}{" "}
                                                                                    <span
                                                                                      style={{
                                                                                        backgroundColor:
                                                                                          phone?.type ===
                                                                                          "Direct"
                                                                                            ? "#38414a"
                                                                                            : "#6a69ff",
                                                                                        padding:
                                                                                          "5px 5px",
                                                                                        fontSize:
                                                                                          "10px",
                                                                                        borderRadius:
                                                                                          "10px",
                                                                                      }}
                                                                                    >
                                                                                      {phone?.type ===
                                                                                      "Work" ? (
                                                                                        profile
                                                                                          ?.company
                                                                                          ?.company
                                                                                      ) : (
                                                                                        <span
                                                                                          className="badge"
                                                                                          style={{
                                                                                            fontSize:
                                                                                              "12px",
                                                                                            borderRadius:
                                                                                              "10px",
                                                                                          }}
                                                                                        >
                                                                                          {
                                                                                            phone?.type
                                                                                          }
                                                                                        </span>
                                                                                      )}
                                                                                    </span>
                                                                                  </div>

                                                                                  {copied &&
                                                                                  copiedEmail ===
                                                                                    phone.phone ? (
                                                                                    <FaCheckCircle
                                                                                      style={{
                                                                                        color:
                                                                                          "green",
                                                                                        width:
                                                                                          "15px",
                                                                                        height:
                                                                                          "15px",
                                                                                        cursor:
                                                                                          "pointer",
                                                                                      }}
                                                                                    />
                                                                                  ) : (
                                                                                    <FaCopy
                                                                                      style={{
                                                                                        color:
                                                                                          "gray",
                                                                                        width:
                                                                                          "15px",
                                                                                        height:
                                                                                          "15px",
                                                                                        cursor:
                                                                                          "pointer",
                                                                                      }}
                                                                                      onClick={(
                                                                                        e
                                                                                      ) => {
                                                                                        handleCopy(
                                                                                          e,
                                                                                          phone
                                                                                        );
                                                                                      }}
                                                                                    />
                                                                                  )}
                                                                                </p>
                                                                              </div>
                                                                            </div>
                                                                          )
                                                                        )}
                                                                      </div>
                                                                    }
                                                                    placement="bottom-start"
                                                                    arrow
                                                                    PopperProps={{
                                                                      modifiers:
                                                                        [
                                                                          {
                                                                            name: "offset",
                                                                            options:
                                                                              {
                                                                                offset:
                                                                                  [
                                                                                    0,
                                                                                    -14,
                                                                                  ],
                                                                              },
                                                                          },
                                                                        ],
                                                                      sx: {
                                                                        "& .MuiTooltip-tooltip":
                                                                          {
                                                                            backgroundColor:
                                                                              "#fff",
                                                                            color:
                                                                              "white",
                                                                          },
                                                                        "& .MuiTooltip-arrow":
                                                                          {
                                                                            color:
                                                                              "#f4f4f4",
                                                                          },
                                                                      },
                                                                    }}
                                                                  >
                                                                    <a
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#phone-modal"
                                                                    >
                                                                      <div
                                                                        className="mobile-usa"
                                                                        onClick={
                                                                          isSmallScreen
                                                                            ? () =>
                                                                                handleOpenSmallScreenModal(
                                                                                  column,
                                                                                  profile
                                                                                )
                                                                            : undefined
                                                                        }
                                                                      >
                                                                        <p
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                          }}
                                                                        >
                                                                          <Verified
                                                                            sx={{
                                                                              fontSize:
                                                                                "18px",
                                                                              color:
                                                                                "#69B3FF",
                                                                            }}
                                                                          />
                                                                          {
                                                                            profile
                                                                              ?.phones[0]
                                                                              ?.phone
                                                                          }
                                                                        </p>
                                                                        <span>
                                                                          {profile
                                                                            ?.phones
                                                                            .length >
                                                                          1
                                                                            ? "+" +
                                                                              (profile
                                                                                ?.phones
                                                                                ?.length -
                                                                                1) +
                                                                              " More"
                                                                            : ""}{" "}
                                                                        </span>
                                                                      </div>
                                                                    </a>
                                                                  </Tooltip>
                                                                ) : (
                                                                  "---"
                                                                )}
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "assignedTo" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  // }
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  title={
                                                                    <div className="popover__content">
                                                                      <div className="popover-zindex">
                                                                        <div className="assign-tittles">
                                                                          <h4
                                                                            style={{
                                                                              display:
                                                                                "flex",
                                                                              gap: "10px",
                                                                              alignItems:
                                                                                "center",
                                                                              fontSize:
                                                                                "14px",
                                                                            }}
                                                                          >
                                                                            <FaUserGroup
                                                                              style={{
                                                                                color:
                                                                                  "#000",
                                                                                width:
                                                                                  "20px",
                                                                                height:
                                                                                  "20px",
                                                                              }}
                                                                            />
                                                                            Assigned
                                                                            To
                                                                          </h4>
                                                                        </div>
                                                                        <div className="search-name">
                                                                          <form className="search-bar">
                                                                            <div className="position-relative">
                                                                              <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter teammate name"
                                                                              />
                                                                              <span className="mdi mdi-magnify"></span>
                                                                            </div>
                                                                          </form>
                                                                        </div>
                                                                        <div className="lead-teama">
                                                                          <div className="form-check form-check-success lead-sucy">
                                                                            <input
                                                                              className="form-check-input"
                                                                              type="checkbox"
                                                                              value=""
                                                                              id="customckeck2"
                                                                            />
                                                                            <label
                                                                              className="form-check-label user-imf"
                                                                              for="customckeck2"
                                                                            >
                                                                              <img
                                                                                src="assets/images/users/user-3.jpg"
                                                                                width="30"
                                                                                height="30"
                                                                              />
                                                                            </label>
                                                                            <label
                                                                              className="form-check-label"
                                                                              for="customckeck2"
                                                                            >
                                                                              Hamid
                                                                              Ali
                                                                            </label>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                -14,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  <a>
                                                                    <div className="popover__title">
                                                                      <p
                                                                        style={{
                                                                          display:
                                                                            "flex",
                                                                          gap: "10px",
                                                                          alignItems:
                                                                            "center",
                                                                          fontSize:
                                                                            "14px",
                                                                        }}
                                                                      >
                                                                        <FaUser
                                                                          style={{
                                                                            color:
                                                                              "#000",
                                                                            width:
                                                                              "15px",
                                                                            height:
                                                                              "15px",
                                                                          }}
                                                                        />
                                                                        Assign
                                                                        to
                                                                        teammate
                                                                      </p>
                                                                    </div>
                                                                  </a>{" "}
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "tags" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  // }
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  title={
                                                                    <div
                                                                      className="popover__content"
                                                                      id={
                                                                        anchorElId
                                                                      }
                                                                    >
                                                                      <div className="add-our-tags">
                                                                        {getTags
                                                                          ?.result
                                                                          .length ===
                                                                        0 ? (
                                                                          <>
                                                                            <img src="assets/images/users/projects-empty-state.svg" />
                                                                            <p>
                                                                              Organize
                                                                              your
                                                                              contacts
                                                                              in
                                                                              tags
                                                                            </p>
                                                                            <button
                                                                              type="button"
                                                                              className="btn btn-add"
                                                                              onClick={(
                                                                                e
                                                                              ) => {
                                                                                handleEditFolderName();
                                                                                setTagId(
                                                                                  profile._id
                                                                                );
                                                                                setAnchorElId(
                                                                                  e.currentTarget
                                                                                );
                                                                              }}
                                                                            >
                                                                              {" "}
                                                                              Create
                                                                              your
                                                                              first
                                                                              Tag
                                                                            </button>
                                                                          </>
                                                                        ) : addTag ? (
                                                                          <Box
                                                                            sx={{
                                                                              display:
                                                                                "flex",
                                                                              flexDirection:
                                                                                "column",
                                                                              gap: "10px",
                                                                            }}
                                                                          >
                                                                            <Typography
                                                                              sx={{
                                                                                display:
                                                                                  "flex",
                                                                                gap: "5px",
                                                                                alignItems:
                                                                                  "center",
                                                                                fontSize:
                                                                                  "18px",
                                                                              }}
                                                                            >
                                                                              <FaTag
                                                                                style={{
                                                                                  color:
                                                                                    "#000",
                                                                                  width:
                                                                                    "20px",
                                                                                  height:
                                                                                    "20px",
                                                                                }}
                                                                              />
                                                                              Tags
                                                                            </Typography>
                                                                            <Divider
                                                                              sx={{
                                                                                backgroundColor:
                                                                                  "#f4f4f4",
                                                                              }}
                                                                            />
                                                                            <TextField
                                                                              id="outlined-basic"
                                                                              label="Search tags"
                                                                              variant="outlined"
                                                                              value={
                                                                                tagSearch
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                setTagSearch(
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              sx={{
                                                                                width:
                                                                                  "100%",
                                                                                fontSize:
                                                                                  "10px",
                                                                                "& .MuiOutlinedInput-root":
                                                                                  {
                                                                                    height:
                                                                                      "45px",
                                                                                    padding:
                                                                                      " 10px",
                                                                                    display:
                                                                                      "flex",
                                                                                    alignItems:
                                                                                      "center",
                                                                                  },
                                                                              }}
                                                                            />
                                                                            <Divider
                                                                              sx={{
                                                                                backgroundColor:
                                                                                  "#f4f4f4",
                                                                              }}
                                                                            />
                                                                            <Scrollbar
                                                                              style={{
                                                                                height:
                                                                                  "200px",
                                                                                width:
                                                                                  "200px",
                                                                              }}
                                                                            >
                                                                              <Box
                                                                                sx={{
                                                                                  display:
                                                                                    "flex",
                                                                                  flexDirection:
                                                                                    "column",
                                                                                }}
                                                                              >
                                                                                {getTags?.result?.map(
                                                                                  (
                                                                                    tag
                                                                                  ) => (
                                                                                    <Box
                                                                                      sx={{
                                                                                        display:
                                                                                          "flex",
                                                                                        gap: "5px",
                                                                                        alignItems:
                                                                                          "center",
                                                                                      }}
                                                                                      key={
                                                                                        tag?._id
                                                                                      }
                                                                                    >
                                                                                      <Checkbox
                                                                                        checked={profile?.tags?.some(
                                                                                          (
                                                                                            t
                                                                                          ) =>
                                                                                            t._id ===
                                                                                            tag._id
                                                                                        )}
                                                                                        onChange={handleCheckboxChange(
                                                                                          profile._id,
                                                                                          tag
                                                                                        )}
                                                                                      />

                                                                                      <p>
                                                                                        {
                                                                                          tag?.name
                                                                                        }
                                                                                      </p>
                                                                                    </Box>
                                                                                  )
                                                                                )}
                                                                              </Box>
                                                                            </Scrollbar>
                                                                            <Divider
                                                                              sx={{
                                                                                backgroundColor:
                                                                                  "#f4f4f4",
                                                                              }}
                                                                            />
                                                                            <Button
                                                                              variant="contained"
                                                                              sx={{
                                                                                backgroundColor:
                                                                                  "#f4f4f4",
                                                                                color:
                                                                                  "#000",
                                                                                textTransform:
                                                                                  "capitalize",
                                                                                "&:hover":
                                                                                  {
                                                                                    backgroundColor:
                                                                                      "#f4f4f4",
                                                                                  },
                                                                              }}
                                                                              onClick={() => {
                                                                                setAddTag(
                                                                                  false
                                                                                );
                                                                              }}
                                                                            >
                                                                              +
                                                                              New
                                                                              tag
                                                                            </Button>
                                                                          </Box>
                                                                        ) : (
                                                                          <div className="modal-dialog modal-dialog-centered modal-sm">
                                                                            <div className="modal-content">
                                                                              <div className="modal-header">
                                                                                {/* back button */}

                                                                                <h1
                                                                                  className="modal-title fs-5"
                                                                                  style={{
                                                                                    whiteSpace:
                                                                                      "nowrap",
                                                                                    width:
                                                                                      "100%",
                                                                                    fontWeight: 600,
                                                                                    fontSize:
                                                                                      "14px",
                                                                                    display:
                                                                                      "flex",
                                                                                    alignItems:
                                                                                      "center",
                                                                                  }}
                                                                                >
                                                                                  <ChevronLeft
                                                                                    onClick={() => {
                                                                                      setAddTag(
                                                                                        true
                                                                                      );
                                                                                    }}
                                                                                    sx={{
                                                                                      color:
                                                                                        "#000",
                                                                                      cursor:
                                                                                        "pointer",
                                                                                      fontSize:
                                                                                        "20px",
                                                                                      marginRight:
                                                                                        "10px",
                                                                                    }}
                                                                                  />
                                                                                  New
                                                                                  Tag
                                                                                </h1>
                                                                                <hr />
                                                                              </div>
                                                                              <div className="modal-body">
                                                                                <form>
                                                                                  <div className="mb-2">
                                                                                    <input
                                                                                      type="text"
                                                                                      className="form-control"
                                                                                      name="name"
                                                                                      placeholder="Tage Name"
                                                                                      value={
                                                                                        editName
                                                                                      }
                                                                                      onChange={(
                                                                                        e
                                                                                      ) => {
                                                                                        setEditName(
                                                                                          e
                                                                                            .target
                                                                                            .value
                                                                                        );
                                                                                      }}
                                                                                    />
                                                                                  </div>

                                                                                  <div className="color-option mb-3">
                                                                                    <h5
                                                                                      style={{
                                                                                        fontWeight: 600,
                                                                                        marginBottom:
                                                                                          "10px",
                                                                                        textAlign:
                                                                                          "left",
                                                                                      }}
                                                                                    >
                                                                                      Set
                                                                                      Color
                                                                                    </h5>
                                                                                    <div className="d-flex flex-wrap">
                                                                                      {colorPalette.map(
                                                                                        (
                                                                                          color,
                                                                                          index
                                                                                        ) => (
                                                                                          <Box
                                                                                            key={
                                                                                              index
                                                                                            }
                                                                                            sx={{
                                                                                              width: 24,
                                                                                              height: 24,
                                                                                              backgroundColor:
                                                                                                color,
                                                                                              borderRadius:
                                                                                                "50%",
                                                                                              margin: 0.5,
                                                                                              cursor:
                                                                                                "pointer",
                                                                                              border:
                                                                                                editColor ===
                                                                                                color
                                                                                                  ? "2px solid #000"
                                                                                                  : "2px solid transparent",
                                                                                            }}
                                                                                            onClick={(
                                                                                              e
                                                                                            ) => {
                                                                                              setEditColor(
                                                                                                color
                                                                                              );
                                                                                            }}
                                                                                          />
                                                                                        )
                                                                                      )}
                                                                                    </div>
                                                                                    {/* <div className="mt-2">
                                                                                    Selected Color: {selectedColor}
                                                                                  </div> */}
                                                                                  </div>

                                                                                  <div className="  d-md-flex justify-content-md-end">
                                                                                    <button
                                                                                      className="btn btn-secondary "
                                                                                      style={{
                                                                                        backgroundColor:
                                                                                          "#000",
                                                                                        color:
                                                                                          "#fff",
                                                                                        backgroundColor:
                                                                                          "#000",
                                                                                        display:
                                                                                          "flex",
                                                                                        alignItems:
                                                                                          "center",
                                                                                        width:
                                                                                          "100px",
                                                                                        whiteSpace:
                                                                                          "nowrap",
                                                                                      }}
                                                                                      type="button"
                                                                                      onClick={() =>
                                                                                        handleCreateTags(
                                                                                          profile
                                                                                        )
                                                                                      }
                                                                                    >
                                                                                      Create
                                                                                      Tag
                                                                                    </button>
                                                                                  </div>
                                                                                </form>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                0,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  <a
                                                                    style={{
                                                                      display:
                                                                        "grid",
                                                                      gridTemplateColumns:
                                                                        "1fr 1fr 1fr",
                                                                    }}
                                                                    onClick={
                                                                      isSmallScreen
                                                                        ? () =>
                                                                            handleOpenSmallScreenModal(
                                                                              column,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                  >
                                                                    {profile
                                                                      ?.tags
                                                                      ?.length >
                                                                    0 ? (
                                                                      <div
                                                                        className=""
                                                                        style={{
                                                                          display:
                                                                            "grid",
                                                                          gridTemplateColumns:
                                                                            "1fr 1fr 1fr",
                                                                          gap: "10px",
                                                                        }}
                                                                      >
                                                                        {profile
                                                                          ?.tags
                                                                          ?.length >
                                                                          0 &&
                                                                          profile?.tags?.map(
                                                                            (
                                                                              tag
                                                                            ) => (
                                                                              <p
                                                                                id={
                                                                                  anchorElId
                                                                                }
                                                                                style={{
                                                                                  display:
                                                                                    "flex",
                                                                                  gap: "5px",
                                                                                  alignItems:
                                                                                    "center",
                                                                                  border: `1px solid #ADADAD`,
                                                                                  padding:
                                                                                    "5px",
                                                                                  borderRadius:
                                                                                    "30px",
                                                                                  fontSize:
                                                                                    "14px",
                                                                                }}
                                                                                onClick={(
                                                                                  e
                                                                                ) => {
                                                                                  setAnchorElId(
                                                                                    e.currentTarget
                                                                                  );
                                                                                }}
                                                                              >
                                                                                <p
                                                                                  style={{
                                                                                    display:
                                                                                      "flex",
                                                                                    gap: "5px",
                                                                                    alignItems:
                                                                                      "center",
                                                                                    fontSize:
                                                                                      "14px",
                                                                                  }}
                                                                                >
                                                                                  <FaTag
                                                                                    style={{
                                                                                      color:
                                                                                        tag?.color
                                                                                          ? tag?.color
                                                                                          : "plum",

                                                                                      width:
                                                                                        "15px",
                                                                                      height:
                                                                                        "15px",
                                                                                    }}
                                                                                  />
                                                                                  {
                                                                                    tag.name
                                                                                  }
                                                                                </p>
                                                                              </p>
                                                                            )
                                                                          )}
                                                                      </div>
                                                                    ) : (
                                                                      <div className="popover__title">
                                                                        <p
                                                                          id={
                                                                            anchorElId
                                                                          }
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                          }}
                                                                          onClick={(
                                                                            e
                                                                          ) => {
                                                                            setAnchorElId(
                                                                              e.currentTarget
                                                                            );
                                                                          }}
                                                                        >
                                                                          <FaFileLines
                                                                            style={{
                                                                              color:
                                                                                "#000",
                                                                              width:
                                                                                "15px",
                                                                              height:
                                                                                "15px",
                                                                            }}
                                                                          />
                                                                          Add
                                                                          tag
                                                                        </p>
                                                                      </div>
                                                                    )}
                                                                  </a>
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "notes" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  // }
                                                                  onClick={(
                                                                    e
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                  }}
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  title={
                                                                    <div className="popover__content">
                                                                      {profile
                                                                        ?.notes
                                                                        ?.length <=
                                                                      0 ? (
                                                                        <div className="add-our-tags">
                                                                          <img src="assets/images/users/notes-empty-state.svg" />
                                                                          <p>
                                                                            Add
                                                                            notes
                                                                            to
                                                                            your
                                                                            contacts
                                                                            to
                                                                            never
                                                                            forget
                                                                            details.
                                                                          </p>
                                                                          <div className="mb-3">
                                                                            <textarea
                                                                              className="form-control"
                                                                              id="exampleFormControlTextarea1"
                                                                              rows="3"
                                                                              placeholder="Type a note"
                                                                              value={
                                                                                note
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                setNote(
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                            ></textarea>
                                                                          </div>
                                                                          <button
                                                                            type="button"
                                                                            className="btn btn-cancel"
                                                                          >
                                                                            {" "}
                                                                            Cancel
                                                                          </button>
                                                                          <button
                                                                            type="button"
                                                                            className="btn btn-note"
                                                                            onClick={(
                                                                              e
                                                                            ) => {
                                                                              e.stopPropagation();
                                                                              handleAddNote(
                                                                                profile
                                                                              );
                                                                            }}
                                                                          >
                                                                            {" "}
                                                                            Add
                                                                            Note
                                                                          </button>
                                                                        </div>
                                                                      ) : (
                                                                        <div
                                                                          className="add-our-tags"
                                                                          style={{
                                                                            width:
                                                                              "250px",
                                                                          }}
                                                                        >
                                                                          <div
                                                                            className="add-note"
                                                                            style={{
                                                                              display:
                                                                                "flex",
                                                                              alignItems:
                                                                                "flex-start",
                                                                            }}
                                                                          >
                                                                            <h5>
                                                                              <FaGripHorizontal
                                                                                style={{
                                                                                  color:
                                                                                    "#000",
                                                                                  width:
                                                                                    "20px",
                                                                                  height:
                                                                                    "20px",
                                                                                  marginRight:
                                                                                    "10px",
                                                                                }}
                                                                              />
                                                                              Notes
                                                                            </h5>
                                                                          </div>
                                                                          <Scrollbar
                                                                            className="note-list"
                                                                            style={{
                                                                              display:
                                                                                "flex",
                                                                              flexDirection:
                                                                                "column",
                                                                              paddingRight:
                                                                                "30px",
                                                                              maxWidth:
                                                                                "450px",
                                                                              height:
                                                                                "200px",
                                                                              overflowY:
                                                                                "auto",
                                                                              marginBottom:
                                                                                "10px",
                                                                            }}
                                                                          >
                                                                            <ul
                                                                              style={{
                                                                                listStyle:
                                                                                  "none",
                                                                                color:
                                                                                  "#000",
                                                                                display:
                                                                                  "flex",
                                                                                flexDirection:
                                                                                  "column",
                                                                                alignItems:
                                                                                  "flex-start",
                                                                                marginTop:
                                                                                  "30px",
                                                                              }}
                                                                            >
                                                                              {profile?.notes?.map(
                                                                                (
                                                                                  note,
                                                                                  index
                                                                                ) => (
                                                                                  <div
                                                                                    key={
                                                                                      index
                                                                                    }
                                                                                    style={{
                                                                                      display:
                                                                                        "flex",
                                                                                      justifyContent:
                                                                                        "space-between",
                                                                                      width:
                                                                                        "100%",
                                                                                    }}
                                                                                  >
                                                                                    <li
                                                                                      style={{
                                                                                        marginBottom:
                                                                                          "1em",
                                                                                        padding:
                                                                                          "0px",
                                                                                        display:
                                                                                          "flex",
                                                                                        flexDirection:
                                                                                          "column",
                                                                                        alignItems:
                                                                                          "flex-start",
                                                                                      }}
                                                                                    >
                                                                                      <div
                                                                                        style={{
                                                                                          fontSize:
                                                                                            "12px",
                                                                                          color:
                                                                                            "gray",
                                                                                          marginBottom:
                                                                                            "0px",
                                                                                          lineHeight:
                                                                                            "1",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          auth
                                                                                            ?.result
                                                                                            ?.firstName
                                                                                        }{" "}
                                                                                        -{" "}
                                                                                        {new Date(
                                                                                          profile.created_at
                                                                                        ).toLocaleString(
                                                                                          "default",
                                                                                          {
                                                                                            month:
                                                                                              "short",
                                                                                          }
                                                                                        )}{" "}
                                                                                        {new Date(
                                                                                          profile.created_at
                                                                                        ).getDate()}

                                                                                        ,{" "}
                                                                                        {new Date(
                                                                                          profile.created_at
                                                                                        ).getFullYear()}{" "}
                                                                                        {new Date(
                                                                                          profile.created_at
                                                                                        ).getHours()}

                                                                                        :
                                                                                        {new Date(
                                                                                          profile.created_at
                                                                                        ).getMinutes()}
                                                                                      </div>
                                                                                      <div
                                                                                        style={{
                                                                                          lineHeight:
                                                                                            "2",
                                                                                          fontSize:
                                                                                            "14px",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          note
                                                                                        }
                                                                                      </div>
                                                                                    </li>
                                                                                    <li>
                                                                                      <FaEllipsisVertical
                                                                                        style={{
                                                                                          color:
                                                                                            "#000",
                                                                                          width:
                                                                                            "15px",
                                                                                          height:
                                                                                            "15px",
                                                                                          cursor:
                                                                                            "pointer",
                                                                                        }}
                                                                                        onClick={(
                                                                                          e
                                                                                        ) => {
                                                                                          setAnchorEditNoteEl(
                                                                                            e.currentTarget
                                                                                          );
                                                                                          setOpenEditNote(
                                                                                            true
                                                                                          );
                                                                                          setEditNote(
                                                                                            note
                                                                                          );
                                                                                          setEditIndex(
                                                                                            index
                                                                                          );
                                                                                          setEditedEmailFieldLeadId(
                                                                                            profile._id
                                                                                          );
                                                                                        }}
                                                                                      />
                                                                                    </li>
                                                                                    <Popover
                                                                                      open={
                                                                                        openEditNote
                                                                                      }
                                                                                      anchorEl={
                                                                                        anchorEditNoteEl
                                                                                      }
                                                                                      onClose={
                                                                                        handleCloseEditNote
                                                                                      }
                                                                                      anchorOrigin={{
                                                                                        vertical:
                                                                                          "center",
                                                                                        horizontal:
                                                                                          "left",
                                                                                      }}
                                                                                      transformOrigin={{
                                                                                        vertical:
                                                                                          "top",
                                                                                        horizontal:
                                                                                          "left",
                                                                                      }}
                                                                                      sx={{
                                                                                        boxShadow:
                                                                                          "none",
                                                                                        "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper":
                                                                                          {
                                                                                            boxShadow:
                                                                                              "0 1px 5px 0 rgba(0, 0, 0, 0.08)",
                                                                                          },
                                                                                        "& .css-1dmzujt":
                                                                                          {
                                                                                            boxShadow:
                                                                                              "0 1px 5px 0 rgba(0, 0, 0, 0.08)",
                                                                                          },
                                                                                        zIndex: 9999,
                                                                                      }}
                                                                                    >
                                                                                      <Box
                                                                                        sx={{
                                                                                          backgroundColor:
                                                                                            "#fff",
                                                                                          boxShadow:
                                                                                            "none",
                                                                                          padding:
                                                                                            "5px 10px",
                                                                                          display:
                                                                                            "flex",
                                                                                          flexDirection:
                                                                                            "column",
                                                                                          alignItems:
                                                                                            "flex-start",
                                                                                          gap: "5px",
                                                                                          fontSize:
                                                                                            "14px",
                                                                                        }}
                                                                                      >
                                                                                        <Button
                                                                                          style={{
                                                                                            backgroundColor:
                                                                                              "transparent",
                                                                                            border:
                                                                                              "none",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                            color:
                                                                                              "black",
                                                                                            fontSize:
                                                                                              "12px",
                                                                                            fontWeight: 500,
                                                                                          }}
                                                                                          onClick={(
                                                                                            e
                                                                                          ) => {
                                                                                            handleEditClick(
                                                                                              e,
                                                                                              note
                                                                                            );
                                                                                            setEditedEmailFieldLeadId(
                                                                                              profile._id
                                                                                            );
                                                                                            setEditedProfileNoteEdit(
                                                                                              true
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          Edit
                                                                                        </Button>
                                                                                        <Button
                                                                                          style={{
                                                                                            backgroundColor:
                                                                                              "transparent",
                                                                                            border:
                                                                                              "none",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                            color:
                                                                                              "#ff0000",
                                                                                            fontSize:
                                                                                              "12px",
                                                                                            fontWeight: 500,
                                                                                          }}
                                                                                          onClick={() => {
                                                                                            setConfirmOpenLeadNote(
                                                                                              true
                                                                                            );
                                                                                            setOpenEditNote(
                                                                                              false
                                                                                            );

                                                                                            setEditNoteDelete(
                                                                                              true
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          Delete
                                                                                        </Button>
                                                                                      </Box>
                                                                                    </Popover>
                                                                                    <Popover
                                                                                      open={
                                                                                        openEditNoteInput
                                                                                      }
                                                                                      anchorReference="anchorPosition"
                                                                                      anchorPosition={{
                                                                                        top: notePosition.top,
                                                                                        left: notePosition.left,
                                                                                      }}
                                                                                      onClose={
                                                                                        handleCloseEditNotePopover
                                                                                      }
                                                                                      anchorOrigin={{
                                                                                        vertical:
                                                                                          "center",
                                                                                        horizontal:
                                                                                          "left",
                                                                                      }}
                                                                                      transformOrigin={{
                                                                                        vertical:
                                                                                          "top",
                                                                                        horizontal:
                                                                                          "left",
                                                                                      }}
                                                                                      sx={{
                                                                                        boxShadow:
                                                                                          "none",
                                                                                        "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper":
                                                                                          {
                                                                                            boxShadow:
                                                                                              "0 1px 5px 0 rgba(0, 0, 0, 0.08)",
                                                                                          },
                                                                                        "& .css-1dmzujt":
                                                                                          {
                                                                                            boxShadow:
                                                                                              "0 1px 5px 0 rgba(0, 0, 0, 0.08)",
                                                                                          },
                                                                                        zIndex: 9999,
                                                                                      }}
                                                                                    >
                                                                                      <Box
                                                                                        sx={{
                                                                                          backgroundColor:
                                                                                            "#fff",
                                                                                          boxShadow:
                                                                                            "none",
                                                                                          padding:
                                                                                            "10px 20px",
                                                                                          display:
                                                                                            "flex",
                                                                                          flexDirection:
                                                                                            "column",
                                                                                          alignItems:
                                                                                            "flex-start",
                                                                                          gap: "5px",
                                                                                          fontSize:
                                                                                            "14px",
                                                                                        }}
                                                                                      >
                                                                                        <Input
                                                                                          type="text"
                                                                                          value={
                                                                                            editNote
                                                                                          }
                                                                                          onChange={(
                                                                                            e
                                                                                          ) => {
                                                                                            e.stopPropagation();
                                                                                            setEditNote(
                                                                                              e
                                                                                                .target
                                                                                                .value
                                                                                            );
                                                                                          }}
                                                                                        />
                                                                                        <Button
                                                                                          style={{
                                                                                            backgroundColor:
                                                                                              "transparent",
                                                                                            border:
                                                                                              "none",
                                                                                            cursor:
                                                                                              "pointer",
                                                                                            color:
                                                                                              "black",
                                                                                            fontSize:
                                                                                              "14px",
                                                                                            fontWeight: 500,
                                                                                            alignContent:
                                                                                              "end",
                                                                                          }}
                                                                                          onClick={() =>
                                                                                            handleUpdateProfile(
                                                                                              index,
                                                                                              profile._id
                                                                                            )
                                                                                          }
                                                                                        >
                                                                                          Save
                                                                                        </Button>
                                                                                      </Box>
                                                                                    </Popover>{" "}
                                                                                  </div>
                                                                                )
                                                                              )}
                                                                            </ul>
                                                                          </Scrollbar>
                                                                          <div className="mb-3">
                                                                            <input
                                                                              className="form-control"
                                                                              id="exampleFormControlTextarea1"
                                                                              rows="3"
                                                                              placeholder="Type a note"
                                                                              value={
                                                                                note
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                setNote(
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              // on press enter
                                                                              onKeyPress={(
                                                                                e
                                                                              ) => {
                                                                                if (
                                                                                  e.key ===
                                                                                  "Enter"
                                                                                ) {
                                                                                  handleAddNote(
                                                                                    profile
                                                                                  );
                                                                                }
                                                                              }}
                                                                            />
                                                                          </div>
                                                                          {/* <button
                                                              type="button"
                                                              className="btn btn-cancel"
                                                              onClick={() => {
                                                                setNote("");
                                                              }
                                                              }
                                                            >
                                                              {" "}
                                                              Cancel
                                                            </button>
                                                            <button
                                                              type="button"
                                                              className="btn btn-note"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddNote( profile._id);
                                                              }}
                                                            >
                                                              {" "}
                                                              Add Note
                                                            </button> */}
                                                                        </div>
                                                                      )}
                                                                    </div>
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                -14,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  <a
                                                                    onClick={
                                                                      isSmallScreen
                                                                        ? () =>
                                                                            handleOpenSmallScreenModal(
                                                                              column,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                  >
                                                                    {profile
                                                                      ?.notes
                                                                      ?.length >
                                                                    0 ? (
                                                                      <div className="">
                                                                        <p
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                          }}
                                                                        >
                                                                          {profile?.notes[0]?.substring(
                                                                            0,
                                                                            20
                                                                          ) +
                                                                            "..."}
                                                                        </p>
                                                                      </div>
                                                                    ) : (
                                                                      <div className="popover__title">
                                                                        <p
                                                                          style={{
                                                                            display:
                                                                              "flex",
                                                                            gap: "5px",
                                                                            alignItems:
                                                                              "center",
                                                                          }}
                                                                        >
                                                                          <FaFileLines
                                                                            style={{
                                                                              color:
                                                                                "#000",
                                                                              width:
                                                                                "15px",
                                                                              height:
                                                                                "15px",
                                                                            }}
                                                                          />
                                                                          Add
                                                                          note
                                                                        </p>
                                                                      </div>
                                                                    )}
                                                                  </a>
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "createdAt" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a>
                                                                  <div className="mobile-usa">
                                                                    <p>
                                                                      {
                                                                        formattedDate
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "updatedFromLinkedin" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a>
                                                                  <div className="mobile-usa">
                                                                    <p>
                                                                      {
                                                                        formattedDate
                                                                      }
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "skills" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                {profile?.skills
                                                                  ?.length >
                                                                0 ? (
                                                                  <Tooltip
                                                                    open={
                                                                      (isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name) ||
                                                                      (!isSmallScreen &&
                                                                        openToolTipId ===
                                                                          profile._id &&
                                                                        openToolTipColumn ===
                                                                          column?.name)
                                                                    }
                                                                    onMouseEnter={
                                                                      !isSmallScreen
                                                                        ? () =>
                                                                            handleOpenTooltip(
                                                                              column?.name,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                    // onMouseLeave={
                                                                    //   !isSmallScreen
                                                                    //     ? () =>
                                                                    //         handleOpenTooltip(
                                                                    //           column?.name,
                                                                    //           profile
                                                                    //         )
                                                                    //     : undefined
                                                                    // }
                                                                    title={
                                                                      <div
                                                                        className="popover__content"
                                                                        style={{
                                                                          width:
                                                                            "300px",
                                                                          maxHeigh:
                                                                            "200px",
                                                                          overflowY:
                                                                            "auto",
                                                                        }}
                                                                      >
                                                                        <div className="skills-section">
                                                                          <div className="sklill-tittle">
                                                                            <h5>
                                                                              Skills
                                                                            </h5>
                                                                          </div>
                                                                          <div className="sklill-list">
                                                                            <ul
                                                                              style={{
                                                                                listStyle:
                                                                                  "inside",
                                                                              }}
                                                                            >
                                                                              {profile?.skills?.map(
                                                                                (
                                                                                  skill,
                                                                                  index
                                                                                ) => {
                                                                                  if (
                                                                                    index >
                                                                                    0
                                                                                  )
                                                                                    return (
                                                                                      <li>
                                                                                        {/* start from 1 index  */}
                                                                                        {
                                                                                          skill?.title
                                                                                        }
                                                                                      </li>
                                                                                    );
                                                                                }
                                                                              )}
                                                                            </ul>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    }
                                                                    disableFocusListener
                                                                    disableHoverListener={
                                                                      isSmallScreen
                                                                    }
                                                                    disableTouchListener={
                                                                      isSmallScreen
                                                                    }
                                                                    placement="bottom-start"
                                                                    arrow
                                                                    PopperProps={{
                                                                      modifiers:
                                                                        [
                                                                          {
                                                                            name: "offset",
                                                                            options:
                                                                              {
                                                                                offset:
                                                                                  [
                                                                                    0,
                                                                                    -14,
                                                                                  ],
                                                                              },
                                                                          },
                                                                        ],
                                                                      sx: {
                                                                        "& .MuiTooltip-tooltip":
                                                                          {
                                                                            backgroundColor:
                                                                              "#fff",
                                                                            color:
                                                                              "white",
                                                                            boxShadow:
                                                                              "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                          },
                                                                        "& .MuiTooltip-arrow":
                                                                          {
                                                                            color:
                                                                              "#f4f4f4",
                                                                          },
                                                                      },
                                                                    }}
                                                                  >
                                                                    <a>
                                                                      <div
                                                                        className="popover__skill_title"
                                                                        onClick={
                                                                          isSmallScreen
                                                                            ? () =>
                                                                                handleOpenSmallScreenModal(
                                                                                  column,
                                                                                  profile
                                                                                )
                                                                            : undefined
                                                                        }
                                                                      >
                                                                        <p>
                                                                          {
                                                                            profile
                                                                              ?.skills[0]
                                                                              ?.title
                                                                          }
                                                                        </p>
                                                                        <span>
                                                                          +
                                                                          {profile
                                                                            ?.skills
                                                                            .length -
                                                                            1}{" "}
                                                                          More
                                                                        </span>
                                                                      </div>
                                                                    </a>
                                                                  </Tooltip>
                                                                ) : (
                                                                  "---"
                                                                )}
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "education_info" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                {profile?.educations &&
                                                                profile
                                                                  ?.educations
                                                                  ?.length >
                                                                  0 ? (
                                                                  <a>
                                                                    <div className="popover__skill_title">
                                                                      <p>
                                                                        {
                                                                          profile
                                                                            ?.educations[0]
                                                                            .uniName
                                                                        }
                                                                      </p>
                                                                      <Tooltip
                                                                        open={
                                                                          (isSmallScreen &&
                                                                            openToolTipId ===
                                                                              profile._id &&
                                                                            openToolTipColumn ===
                                                                              column?.name) ||
                                                                          (!isSmallScreen &&
                                                                            openToolTipId ===
                                                                              profile._id &&
                                                                            openToolTipColumn ===
                                                                              column?.name)
                                                                        }
                                                                        onMouseEnter={
                                                                          !isSmallScreen
                                                                            ? () =>
                                                                                handleOpenTooltip(
                                                                                  column?.name,
                                                                                  profile
                                                                                )
                                                                            : undefined
                                                                        }
                                                                        // onMouseLeave={
                                                                        //   !isSmallScreen
                                                                        //     ? () =>
                                                                        //         handleOpenTooltip(
                                                                        //           column?.name,
                                                                        //           profile
                                                                        //         )
                                                                        //     : undefined
                                                                        // }
                                                                        disableFocusListener
                                                                        disableHoverListener={
                                                                          isSmallScreen
                                                                        }
                                                                        disableTouchListener={
                                                                          isSmallScreen
                                                                        }
                                                                        title={
                                                                          <div
                                                                            className="popover__content"
                                                                            style={{
                                                                              width:
                                                                                "300px",
                                                                              maxHeigh:
                                                                                "400px",
                                                                              overflowY:
                                                                                "auto",
                                                                            }}
                                                                          >
                                                                            <div className="skills-section">
                                                                              <div className="sklill-tittle">
                                                                                <h5>
                                                                                  Education
                                                                                </h5>
                                                                              </div>
                                                                              <div className="sklill-list">
                                                                                <ul
                                                                                  style={{
                                                                                    listStyle:
                                                                                      "inside",
                                                                                  }}
                                                                                >
                                                                                  {profile?.educations?.map(
                                                                                    (
                                                                                      edu,
                                                                                      index
                                                                                    ) => {
                                                                                      if (
                                                                                        index >
                                                                                        0
                                                                                      )
                                                                                        return (
                                                                                          <li
                                                                                            key={
                                                                                              index
                                                                                            }
                                                                                          >
                                                                                            {
                                                                                              edu?.uniName
                                                                                            }
                                                                                          </li>
                                                                                        );
                                                                                    }
                                                                                  )}
                                                                                </ul>
                                                                              </div>
                                                                            </div>
                                                                          </div>
                                                                        }
                                                                        placement="bottom-start"
                                                                        arrow
                                                                        PopperProps={{
                                                                          modifiers:
                                                                            [
                                                                              {
                                                                                name: "offset",
                                                                                options:
                                                                                  {
                                                                                    offset:
                                                                                      [
                                                                                        0,
                                                                                        -14,
                                                                                      ],
                                                                                  },
                                                                              },
                                                                            ],
                                                                          sx: {
                                                                            "& .MuiTooltip-tooltip":
                                                                              {
                                                                                backgroundColor:
                                                                                  "#fff",
                                                                                color:
                                                                                  "white",
                                                                                boxShadow:
                                                                                  "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                              },
                                                                            "& .MuiTooltip-arrow":
                                                                              {
                                                                                color:
                                                                                  "#f4f4f4",
                                                                              },
                                                                          },
                                                                        }}
                                                                      >
                                                                        <span
                                                                          onClick={
                                                                            isSmallScreen
                                                                              ? () =>
                                                                                  handleOpenSmallScreenModal(
                                                                                    column,
                                                                                    profile
                                                                                  )
                                                                              : undefined
                                                                          }
                                                                        >
                                                                          {profile
                                                                            ?.educations
                                                                            .length -
                                                                            1 >
                                                                          0
                                                                            ? "+" +
                                                                              (profile
                                                                                ?.educations
                                                                                .length -
                                                                                1) +
                                                                              " More"
                                                                            : ""}{" "}
                                                                        </span>
                                                                      </Tooltip>
                                                                    </div>
                                                                  </a>
                                                                ) : (
                                                                  "---"
                                                                )}
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "current_job_experience" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a>
                                                                  <div
                                                                    className="popover__skill_title"
                                                                    onClick={
                                                                      isSmallScreen
                                                                        ? () =>
                                                                            handleOpenSmallScreenModal(
                                                                              column,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                  >
                                                                    <p>
                                                                      {profile
                                                                        ?.currentPositions
                                                                        ?.length >
                                                                      0
                                                                        ? profile?.currentPositions &&
                                                                          profile?.currentPositions[0]?.position?.substring(
                                                                            0,
                                                                            10
                                                                          ) +
                                                                            "..."
                                                                        : "---"}
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                                <Tooltip
                                                                  open={
                                                                    (isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name) ||
                                                                    (!isSmallScreen &&
                                                                      openToolTipId ===
                                                                        profile._id &&
                                                                      openToolTipColumn ===
                                                                        column?.name)
                                                                  }
                                                                  onMouseEnter={
                                                                    !isSmallScreen
                                                                      ? () =>
                                                                          handleOpenTooltip(
                                                                            column?.name,
                                                                            profile
                                                                          )
                                                                      : undefined
                                                                  }
                                                                  // onMouseLeave={
                                                                  //   !isSmallScreen
                                                                  //     ? () =>
                                                                  //         handleOpenTooltip(
                                                                  //           column?.name,
                                                                  //           profile
                                                                  //         )
                                                                  //     : undefined
                                                                  //       }
                                                                  title={
                                                                    <div
                                                                      className="popover__content"
                                                                      style={{
                                                                        width:
                                                                          "300px",
                                                                        maxHeigh:
                                                                          "400px",
                                                                        overflowY:
                                                                          "auto",
                                                                      }}
                                                                    >
                                                                      <div className="skills-section">
                                                                        <div className="sklill-tittle">
                                                                          <h5>
                                                                            Current
                                                                            Positions
                                                                          </h5>
                                                                        </div>
                                                                        <div
                                                                          className="sklill-list"
                                                                          style={{
                                                                            marginTop:
                                                                              "20px",
                                                                          }}
                                                                        >
                                                                          {profile?.currentPositions &&
                                                                            profile?.currentPositions?.map(
                                                                              (
                                                                                pos,
                                                                                index
                                                                              ) => {
                                                                                if (
                                                                                  index >
                                                                                  0
                                                                                )
                                                                                  return (
                                                                                    <ul
                                                                                      style={{
                                                                                        listStyle:
                                                                                          "inside",
                                                                                        padding:
                                                                                          "0",
                                                                                        margin:
                                                                                          "0",
                                                                                      }}
                                                                                    >
                                                                                      <li>
                                                                                        {
                                                                                          pos?.position
                                                                                        }
                                                                                      </li>
                                                                                    </ul>
                                                                                  );
                                                                              }
                                                                            )}
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  }
                                                                  disableFocusListener
                                                                  disableHoverListener={
                                                                    isSmallScreen
                                                                  }
                                                                  disableTouchListener={
                                                                    isSmallScreen
                                                                  }
                                                                  placement="bottom-start"
                                                                  arrow
                                                                  PopperProps={{
                                                                    modifiers: [
                                                                      {
                                                                        name: "offset",
                                                                        options:
                                                                          {
                                                                            offset:
                                                                              [
                                                                                0,
                                                                                -14,
                                                                              ],
                                                                          },
                                                                      },
                                                                    ],
                                                                    sx: {
                                                                      "& .MuiTooltip-tooltip":
                                                                        {
                                                                          backgroundColor:
                                                                            "#fff",
                                                                          color:
                                                                            "white",
                                                                          boxShadow:
                                                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                        },
                                                                      "& .MuiTooltip-arrow":
                                                                        {
                                                                          color:
                                                                            "#f4f4f4",
                                                                        },
                                                                    },
                                                                  }}
                                                                >
                                                                  <span>
                                                                    {profile?.currentPositions &&
                                                                      profile
                                                                        ?.currentPositions
                                                                        ?.length >
                                                                        1 &&
                                                                      "+ " +
                                                                        (profile
                                                                          ?.currentPositions
                                                                          ?.length -
                                                                          1) +
                                                                        " More"}{" "}
                                                                  </span>
                                                                </Tooltip>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "past_job_experience" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a>
                                                                  <div
                                                                    className="popover__skill_title"
                                                                    onClick={
                                                                      isSmallScreen
                                                                        ? () =>
                                                                            handleOpenSmallScreenModal(
                                                                              column,
                                                                              profile
                                                                            )
                                                                        : undefined
                                                                    }
                                                                  >
                                                                    <p>
                                                                      {profile
                                                                        ?.pastPositions
                                                                        ?.length >
                                                                      0
                                                                        ? profile?.pastPositions &&
                                                                          profile
                                                                            ?.pastPositions[0]
                                                                            ?.position
                                                                        : "---"}
                                                                    </p>
                                                                    <Tooltip
                                                                      open={
                                                                        (isSmallScreen &&
                                                                          openToolTipId ===
                                                                            profile._id &&
                                                                          openToolTipColumn ===
                                                                            column?.name) ||
                                                                        (!isSmallScreen &&
                                                                          openToolTipId ===
                                                                            profile._id &&
                                                                          openToolTipColumn ===
                                                                            column?.name)
                                                                      }
                                                                      onMouseEnter={
                                                                        !isSmallScreen
                                                                          ? () =>
                                                                              handleOpenTooltip(
                                                                                column?.name,
                                                                                profile
                                                                              )
                                                                          : undefined
                                                                      }
                                                                      onMouseLeave={
                                                                        !isSmallScreen
                                                                          ? () =>
                                                                              handleOpenTooltip(
                                                                                column?.name,
                                                                                profile
                                                                              )
                                                                          : undefined
                                                                      }
                                                                      disableFocusListener
                                                                      disableHoverListener={
                                                                        isSmallScreen
                                                                          ? true
                                                                          : false
                                                                      }
                                                                      disableTouchListener
                                                                      title={
                                                                        <div
                                                                          className="popover__content"
                                                                          style={{
                                                                            width:
                                                                              "300px",
                                                                            maxHeigh:
                                                                              "400px",
                                                                            overflowY:
                                                                              "auto",
                                                                          }}
                                                                        >
                                                                          <div className="skills-section">
                                                                            <div className="sklill-tittle">
                                                                              <h5>
                                                                                Past
                                                                                Positions
                                                                              </h5>
                                                                            </div>
                                                                            <div
                                                                              className="sklill-list"
                                                                              style={{
                                                                                marginTop:
                                                                                  "20px",
                                                                              }}
                                                                            >
                                                                              <ul
                                                                                style={{
                                                                                  listStyle:
                                                                                    "inside",
                                                                                  padding:
                                                                                    "0",
                                                                                  margin:
                                                                                    "0",
                                                                                }}
                                                                              >
                                                                                {profile?.pastPositions &&
                                                                                  profile
                                                                                    ?.pastPositions
                                                                                    ?.length >
                                                                                    0 &&
                                                                                  profile?.pastPositions?.map(
                                                                                    (
                                                                                      pos,
                                                                                      index
                                                                                    ) => {
                                                                                      if (
                                                                                        index >
                                                                                        1
                                                                                      )
                                                                                        return (
                                                                                          <li>
                                                                                            {
                                                                                              pos?.position
                                                                                            }
                                                                                          </li>
                                                                                        );
                                                                                    }
                                                                                  )}
                                                                              </ul>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      }
                                                                      placement="bottom-start"
                                                                      arrow
                                                                      PopperProps={{
                                                                        modifiers:
                                                                          [
                                                                            {
                                                                              name: "offset",
                                                                              options:
                                                                                {
                                                                                  offset:
                                                                                    [
                                                                                      0,
                                                                                      -14,
                                                                                    ],
                                                                                },
                                                                            },
                                                                          ],
                                                                        sx: {
                                                                          "& .MuiTooltip-tooltip":
                                                                            {
                                                                              backgroundColor:
                                                                                "#fff",
                                                                              color:
                                                                                "white",
                                                                              boxShadow:
                                                                                "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                                            },
                                                                          "& .MuiTooltip-arrow":
                                                                            {
                                                                              color:
                                                                                "#f4f4f4",
                                                                            },
                                                                        },
                                                                      }}
                                                                    >
                                                                      <span>
                                                                        {profile?.pastPositions &&
                                                                          profile
                                                                            ?.pastPositions
                                                                            ?.length >
                                                                            2 &&
                                                                          "+ " +
                                                                            (profile
                                                                              ?.pastPositions
                                                                              ?.length -
                                                                              2) +
                                                                            " More"}{" "}
                                                                      </span>
                                                                    </Tooltip>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "created_by" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#phone-modal"
                                                                >
                                                                  <div className="mobile-usa">
                                                                    <p
                                                                      style={{
                                                                        display:
                                                                          "flex",
                                                                        gap: "5px",
                                                                        alignItems:
                                                                          "center",
                                                                      }}
                                                                    >
                                                                      ---
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "country" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#phone-modal"
                                                                >
                                                                  <div className="mobile-usa">
                                                                    <p
                                                                      style={{
                                                                        display:
                                                                          "flex",
                                                                        gap: "5px",
                                                                        alignItems:
                                                                          "center",
                                                                      }}
                                                                    >
                                                                      {profile?.country
                                                                        ? profile?.country
                                                                        : "---"}
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "city" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#phone-modal"
                                                                >
                                                                  <div className="mobile-usa">
                                                                    <p
                                                                      style={{
                                                                        display:
                                                                          "flex",
                                                                        gap: "5px",
                                                                        alignItems:
                                                                          "center",
                                                                      }}
                                                                    >
                                                                      {profile?.city
                                                                        ? profile?.city
                                                                        : "---"}
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                      {columnData?.map(
                                                        (column) => {
                                                          if (
                                                            column?.name ===
                                                              "state" &&
                                                            column?.display ===
                                                              true
                                                          )
                                                            return (
                                                              <TableCell
                                                                style={{
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                              >
                                                                <a
                                                                  data-bs-toggle="modal"
                                                                  data-bs-target="#phone-modal"
                                                                >
                                                                  <div className="mobile-usa">
                                                                    <p
                                                                      style={{
                                                                        display:
                                                                          "flex",
                                                                        gap: "5px",
                                                                        alignItems:
                                                                          "center",
                                                                      }}
                                                                    >
                                                                      {profile?.state
                                                                        ? profile?.state
                                                                        : "---"}
                                                                    </p>
                                                                  </div>
                                                                </a>
                                                              </TableCell>
                                                            );
                                                        }
                                                      )}
                                                    </TableRow>
                                                  );
                                                }
                                              )}
                                            {(isLoading ||
                                              isFetchingProfiles) && (
                                              <TableRow>
                                                <TableCell colSpan={12}>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <CircularProgress />
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            )}
                                            {!isLoading &&
                                              !isFetchingProfiles &&
                                              getProfiles?.result?.allLeads
                                                ?.length === 0 && (
                                                <TableRow>
                                                  <TableCell colSpan={24}>
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        width: "70%",
                                                      }}
                                                    >
                                                      <p>No data found</p>
                                                    </div>
                                                  </TableCell>
                                                </TableRow>
                                              )}
                                          </TableBody>
                                        </Table>
                                      </ClickAwayListener>
                                    </div>
                                    <div
                                      className="pagination-container"
                                      style={{
                                        maxWidth: "100%",
                                        overflowX: "auto",
                                        display: "flex",
                                        // direction column in small screen
                                        flexDirection: isSmallScreen
                                          ? "column"
                                          : "",
                                      }}
                                    >
                                      <div className="pagination-controls">
                                        <label
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Items per page
                                          <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            style={{
                                              // style for select
                                              padding: "5px",
                                              borderRadius: "5px",
                                              border: "1px solid #ccc",
                                              marginLeft: "10px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {itemsPerPageOptions.map(
                                              (option) => (
                                                <option
                                                  key={option}
                                                  value={option}
                                                >
                                                  {option}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        </label>
                                      </div>
                                      <ul className="pagination pagination-rounded mb-0 pt-4">
                                        {/* first page */}
                                        {getVisiblePages()?.length > 3 &&
                                          currentPage > 3 && (
                                            <li
                                              className="page-item"
                                              onClick={() => handlePageClick(1)}
                                              style={{ cursor: "pointer" }}
                                            >
                                              <a className="page-link">1</a>
                                            </li>
                                          )}
                                        <li
                                          className="page-item"
                                          onClick={handlePrevClick}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <a
                                            className="page-link"
                                            aria-label="Previous"
                                          >
                                            <span aria-hidden="true">«</span>
                                            <span className="visually-hidden">
                                              Previous
                                            </span>
                                          </a>
                                        </li>
                                        {getVisiblePages().map((page) => (
                                          <li
                                            key={page}
                                            className={`page-item ${
                                              page === (currentPage || pages)
                                                ? "active"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handlePageClick(page)
                                            }
                                            style={{ cursor: "pointer" }}
                                          >
                                            <a className="page-link">{page}</a>
                                          </li>
                                        ))}
                                        <li
                                          className="page-item"
                                          onClick={handleNextClick}
                                        >
                                          <a
                                            className="page-link"
                                            aria-label="Next"
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span aria-hidden="true">»</span>
                                            <span className="visually-hidden">
                                              Next
                                            </span>
                                          </a>
                                        </li>
                                        {totalPages > 5 &&
                                          currentPage < totalPages - 2 && (
                                            <li
                                              className="page-item"
                                              onClick={() =>
                                                handlePageClick(totalPages)
                                              }
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            >
                                              <a className="page-link">
                                                ...{totalPages}
                                              </a>
                                            </li>
                                          )}
                                      </ul>
                                    </div>{" "}
                                  </div>
                                )}
                                {recentlyCreated && (
                                  <div
                                    className="tab-pane"
                                    id="recentlyCreated"
                                  >
                                    <div
                                      className={` ${
                                        isSmallScreen ? "" : "row mb-2"
                                      }   ,
                                    width: "100%"
                                
                                `}
                                    >
                                      <div className="col-sm-2">
                                        <div className="col-auto">
                                          <form className="mb-2 mb-sm-0">
                                            <label
                                              for="inputPassword2"
                                              className="visually-hidden"
                                            >
                                              Search
                                            </label>
                                            <input
                                              type="search"
                                              className="form-control"
                                              id="inputPassword2"
                                              placeholder="Search..."
                                            />
                                          </form>
                                        </div>
                                      </div>
                                      <div className="col-sm-7">
                                        <div
                                          className="btn-group mb-2"
                                          style={{ paddingRight: "5px" }}
                                        >
                                          <button
                                            type="button"
                                            className={`btn btn-light dropdown-toggle ${
                                              activeDropdown === "tags"
                                                ? "show"
                                                : ""
                                            }`}
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={
                                              activeDropdown === "tags"
                                            }
                                            onClick={() =>
                                              handleDropdownToggle("tags")
                                            }
                                          >
                                            Tags{" "}
                                            <i className="mdi mdi-chevron-down"></i>
                                          </button>
                                          <div
                                            className={`dropdown-menu ${
                                              activeDropdown === "tags"
                                                ? "show"
                                                : ""
                                            }`}
                                          >
                                            <a className="dropdown-item">
                                              Organize your contacts in tags
                                            </a>
                                          </div>
                                        </div>
                                        {/* /btn-group */}
                                        <div
                                          className="btn-group mb-2"
                                          style={{ paddingRight: "5px" }}
                                        >
                                          <button
                                            type="button"
                                            className={`btn btn-light dropdown-toggle ${
                                              activeDropdown === "created"
                                                ? "show"
                                                : ""
                                            }`}
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={
                                              activeDropdown === "created"
                                            }
                                            onClick={() =>
                                              handleDropdownToggle("created")
                                            }
                                          >
                                            Created{" "}
                                            <i className="mdi mdi-chevron-down"></i>
                                          </button>
                                          <div
                                            className={`dropdown-menu ${
                                              activeDropdown === "created"
                                                ? "show"
                                                : ""
                                            }`}
                                          >
                                            <a className="dropdown-item">
                                              Today
                                            </a>
                                            <a className="dropdown-item">
                                              Exact Date
                                            </a>
                                            <a className="dropdown-item">
                                              Before Date
                                            </a>
                                            <a className="dropdown-item">
                                              After Date
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              This Week
                                            </a>
                                            <a className="dropdown-item">
                                              This Month
                                            </a>
                                            <a className="dropdown-item">
                                              Last Month
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              Custom Range
                                            </a>
                                          </div>
                                        </div>
                                        {/* /btn-group */}
                                        <div
                                          className="btn-group mb-2"
                                          style={{ paddingRight: "5px" }}
                                        >
                                          <button
                                            type="button"
                                            className={`btn btn-light dropdown-toggle ${
                                              activeDropdown === "updated"
                                                ? "show"
                                                : ""
                                            }`}
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={
                                              activeDropdown === "updated"
                                            }
                                            onClick={() =>
                                              handleDropdownToggle("updated")
                                            }
                                          >
                                            Updated{" "}
                                            <i className="mdi mdi-chevron-down"></i>
                                          </button>
                                          <div
                                            className={`dropdown-menu ${
                                              activeDropdown === "updated"
                                                ? "show"
                                                : ""
                                            }`}
                                          >
                                            <a className="dropdown-item">
                                              Today
                                            </a>
                                            <a className="dropdown-item">
                                              Exact Date
                                            </a>
                                            <a className="dropdown-item">
                                              Before Date
                                            </a>
                                            <a className="dropdown-item">
                                              After Date
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              This Week
                                            </a>
                                            <a className="dropdown-item">
                                              This Month
                                            </a>
                                            <a className="dropdown-item">
                                              Last Month
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              Custom Range
                                            </a>
                                          </div>
                                        </div>
                                        {/* /btn-group */}
                                        {/* <div
                                          className="btn-group mb-2"
                                          style={{ paddingRight: "5px" }}
                                        >
                                          <button
                                            type="button"
                                            className={`btn btn-light dropdown-toggle ${
                                              activeDropdown === "createdBy"
                                                ? "show"
                                                : ""
                                            }`}
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={
                                              activeDropdown === "createdBy"
                                            }
                                            onClick={() =>
                                              handleDropdownToggle("createdBy")
                                            }
                                          >
                                            Created by{" "}
                                            <i className="mdi mdi-chevron-down"></i>
                                          </button>
                                          <div
                                            className={`dropdown-menu ${
                                              activeDropdown === "createdBy"
                                                ? "show"
                                                : ""
                                            }`}
                                            style={{ width: "250px" }}
                                          >
                                            <a className="dropdown-item">
                                              <form className="mb-2 mb-sm-0">
                                                <label
                                                  htmlFor="inputPassword2"
                                                  className="visually-hidden"
                                                >
                                                  Search
                                                </label>
                                                <input
                                                  type="search"
                                                  className="form-control"
                                                  id="inputPassword2"
                                                  placeholder="Enter teammate name..."
                                                />
                                              </form>
                                            </a>
                                            <a className="dropdown-item">
                                              <div className="form-check mb-2 form-check-success">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  value=""
                                                  id="customckeck2"
                                                />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="customckeck1"
                                                >
                                                  Hamid Ali
                                                </label>
                                              </div>
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              <div className="form-check mb-2 form-check-success">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  value=""
                                                  id="customckeck2"
                                                />
                                                <img
                                                  src="assets/images/users/user-4.jpg"
                                                  alt="table-user"
                                                  className="me-2 rounded-circle rounded-circle-img"
                                                />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor="customckeck1"
                                                >
                                                  Murugan
                                                </label>
                                              </div>
                                            </a>
                                          </div>
                                        </div> */}
                                        {/* /btn-group */}
                                        <div
                                          className="btn-group mb-2"
                                          style={{ paddingRight: "5px" }}
                                        >
                                          <button
                                            type="button"
                                            className={`btn btn-light dropdown-toggle ${
                                              activeDropdownMore ? "show" : ""
                                            }`}
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={activeDropdownMore}
                                            onClick={() =>
                                              setActiveDropdownMore(true)
                                            }
                                          >
                                            More...{" "}
                                            <i className="mdi mdi-chevron-down"></i>
                                          </button>
                                          <div
                                            className={`dropdown-menu ${
                                              activeDropdownMore ? "show" : ""
                                            }`}
                                          >
                                            <a className="dropdown-item">
                                              Action
                                            </a>
                                            <a className="dropdown-item">
                                              Another action
                                            </a>
                                            <a className="dropdown-item">
                                              Something else here
                                            </a>
                                            <div className="dropdown-divider"></div>
                                            <a className="dropdown-item">
                                              Separated link
                                            </a>
                                          </div>
                                        </div>
                                        {/* /btn-group */}
                                      </div>
                                      <div className="col-sm-3">
                                        <div className="text-sm-end mt-2 mt-sm-0">
                                          <div
                                            className="btn-group mb-2"
                                            style={{
                                              marginRight: "5px",
                                            }}
                                          >
                                            <button
                                              type="button"
                                              className={`btn btn-success dropdown-toggle ${
                                                activeDropdown === "settings"
                                                  ? "show"
                                                  : ""
                                              }`}
                                              data-bs-toggle="dropdown"
                                              aria-haspopup="true"
                                              aria-expanded={
                                                activeDropdown === "settings"
                                              }
                                              onClick={() =>
                                                handleDropdownToggle("settings")
                                              }
                                            >
                                              Settings{" "}
                                              <i className="mdi mdi-chevron-down"></i>
                                            </button>
                                            <div
                                              className={`dropdown-menu ${
                                                activeDropdown === "settings"
                                                  ? "show"
                                                  : ""
                                              }`}
                                            >
                                              {activeDropdown ===
                                                "settings" && (
                                                <>
                                                  <a
                                                    className="dropdown-item"
                                                    style={{
                                                      zIndex: 9999,
                                                    }}
                                                  >
                                                    <div>
                                                      <i className="fa-solid fa-chart-simple"></i>{" "}
                                                      Organize Columns
                                                    </div>
                                                  </a>
                                                  <a className="dropdown-item">
                                                    <i className="fa-solid fa-retweet"></i>{" "}
                                                    Sort Columns
                                                  </a>
                                                  {/* <a className="dropdown-item">
                                                    <i className="fa-solid fa-envelope"></i>{" "}
                                                    Emails Display Settings
                                                  </a>
                                                  <a className="dropdown-item">
                                                    <i className="fa-solid fa-square-phone"></i>{" "}
                                                    Phones Display Settings
                                                  </a> */}
                                                </>
                                              )}
                                              {activeDropdown ===
                                                "organize" && (
                                                <>
                                                  <Box>
                                                    <Typography
                                                      variant="h6"
                                                      gutterBottom
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                      }}
                                                    >
                                                      <ChevronLeft
                                                        onClick={() => {
                                                          handleDropdownToggle(
                                                            "settings"
                                                          );
                                                        }}
                                                      />
                                                      Organize Columns
                                                    </Typography>
                                                    <Divider />
                                                    <Box>
                                                      <FormControl component="fieldset">
                                                        <FormLabel component="legend">
                                                          Assign column to
                                                          display
                                                        </FormLabel>
                                                        <FormGroup>
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedA
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedA"
                                                              />
                                                            }
                                                            label="First Name"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedB
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedB"
                                                              />
                                                            }
                                                            label="Last Name"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedC
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedC"
                                                              />
                                                            }
                                                            label="Email"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedD
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedD"
                                                              />
                                                            }
                                                            label="Phone"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedE
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedE"
                                                              />
                                                            }
                                                            label="Company"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedF
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedF"
                                                              />
                                                            }
                                                            label="Position"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedG
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedG"
                                                              />
                                                            }
                                                            label="Location"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedH
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedH"
                                                              />
                                                            }
                                                            label="Lead Status"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedI
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedI"
                                                              />
                                                            }
                                                            label="Created At"
                                                          />
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                // checked={
                                                                //   state.checkedJ
                                                                // }
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                name="checkedJ"
                                                              />
                                                            }
                                                            label="Updated At"
                                                          />
                                                        </FormGroup>
                                                      </FormControl>
                                                    </Box>
                                                  </Box>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                          {/* /btn-group */}
                                          <div className="btn-group mb-2">
                                            <button
                                              type="button"
                                              className={`btn btn-info dropdown-toggle ${
                                                activeDropdown === "export"
                                                  ? "show"
                                                  : ""
                                              }`}
                                              data-bs-toggle="dropdown"
                                              aria-haspopup="true"
                                              aria-expanded={
                                                activeDropdown === "export"
                                              }
                                              onClick={() =>
                                                setActiveDropdownExport(true)
                                              }
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px",
                                              }}
                                            >
                                              <FaDownload />
                                              Export
                                            </button>
                                          </div>
                                          {/* /btn-group */}
                                        </div>
                                      </div>
                                      {/* <!-- end col--> */}
                                    </div>
                                    <div className="table-responsive">
                                      <Table
                                        className="table table-centered  "
                                        id="products-datatable"
                                        sx={{
                                          minWidth: 650,
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        <TableHead
                                          style={{
                                            backgroundColor: "#fff",
                                          }}
                                        >
                                          <TableRow>
                                            <TableCell
                                              style={{ width: "50px" }}
                                            >
                                              <div className="dropdown">
                                                <a
                                                  className={`dropdown-toggle h5 mb-1 d-block ${
                                                    activeDropdown === "lead"
                                                      ? "show"
                                                      : ""
                                                  }`}
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded={
                                                    activeDropdown === "lead"
                                                  }
                                                  onClick={() =>
                                                    handleDropdownToggle("lead")
                                                  }
                                                  style={{ width: "150px" }}
                                                >
                                                  Lead Status{" "}
                                                  <i className="mdi mdi-chevron-down ms-1"></i>
                                                </a>
                                                <div
                                                  div
                                                  className={`dropdown-menu user-pro-dropdown ${
                                                    activeDropdown === "lead"
                                                      ? "show"
                                                      : ""
                                                  }`}
                                                  style={{ width: "250px" }}
                                                >
                                                  {/* <!-- item--> */}
                                                  <a className="dropdown-item notify-item">
                                                    <i className="fe-user me-1"></i>
                                                    <span>
                                                      user-pro-dropdown
                                                    </span>
                                                  </a>
                                                  {/* <!-- item--> */}
                                                  <a className="dropdown-item notify-item">
                                                    <i className="fe-user me-1"></i>
                                                    <span>Hide Column</span>
                                                  </a>
                                                </div>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          <TableRow>
                                            <TableCell>
                                              <Tooltip
                                                title={
                                                  <div className="popover__content">
                                                    <div className="leading-states">
                                                      <div className="leading-states-left">
                                                        <h5>
                                                          <FaAddressCard
                                                            style={{
                                                              color: "#000",
                                                              width: "20px",
                                                              height: "20px",
                                                            }}
                                                          />
                                                          Lead Status
                                                        </h5>
                                                      </div>
                                                      <div className="leading-states-right">
                                                        {/* <a >
                                                          Set Order
                                                        </a> */}
                                                      </div>
                                                    </div>
                                                    <div className="most-checkboxes">
                                                      {radioOptions.map(
                                                        (option, index) => (
                                                          <div
                                                            className={`form-check mb-2 ${option.color}`}
                                                            key={index}
                                                          >
                                                            <input
                                                              className="form-check-input"
                                                              type="radio"
                                                              name="flexRadioDefault"
                                                              id={`customradio${
                                                                index + 1
                                                              }`}
                                                              value={
                                                                option.value
                                                              }
                                                              checked={
                                                                selectedValue ===
                                                                option.value
                                                              }
                                                              onChange={
                                                                handleChange
                                                              }
                                                            />
                                                            <label
                                                              className="form-check-label"
                                                              htmlFor={`customradio${
                                                                index + 1
                                                              }`}
                                                            >
                                                              {option.name}
                                                            </label>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                }
                                                placement="bottom-start"
                                                arrow
                                                PopperProps={{
                                                  modifiers: [
                                                    {
                                                      name: "offset",
                                                      options: {
                                                        offset: [0, -14],
                                                      },
                                                    },
                                                  ],
                                                  sx: {
                                                    "& .MuiTooltip-tooltip": {
                                                      backgroundColor: "#fff",
                                                      color: "white",
                                                      boxShadow:
                                                        "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                                    },
                                                    "& .MuiTooltip-arrow": {
                                                      color: "#f4f4f4",
                                                    },
                                                  },
                                                }}
                                              >
                                                <a
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#lead-modal"
                                                  style={{ width: "50px" }}
                                                >
                                                  <div
                                                    className="added-by "
                                                    style={{
                                                      backgroundColor: "#fffff",
                                                      padding: "10px 10px",
                                                      borderRadius: "30px",
                                                      width: "150px",
                                                    }}
                                                  >
                                                    <h6
                                                      style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      <FaRightFromBracket />
                                                      Added
                                                    </h6>
                                                  </div>
                                                </a>
                                              </Tooltip>
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                )}
                                {/* {newView && (
                                <div className="tab-pane" id="newView">
                                  <p>
                                    Vakal text here dolor sit amet, consectetuer
                                    adipiscing elit. Aenean commodo ligula eget
                                    dolor. Aenean massa. Cum sociis natoque
                                    penatibus et magnis dis parturient montes,
                                    nascetur ridiculus mus. Donec quam felis,
                                    ultricies nec, pellentesque eu, pretium
                                    quis, sem. Nulla consequat massa quis enim.
                                  </p>
                                  <p className="mb-0">
                                    Donec pede justo, fringilla vel, aliquet
                                    nec, vulputate eget, arcu. In enim justo,
                                    rhoncus ut, imperdiet a, venenatis vitae,
                                    justo. Nullam dictum felis eu pede mollis
                                    pretium. Integer tincidunt.Cras dapibus.
                                    Vivamus elementum semper nisi. Aenean
                                    vulputate eleifend tellus. Aenean leo
                                    ligula, porttitor eu, consequat vitae,
                                    eleifend ac, enim.
                                  </p>
                                </div>
                              )} */}
                              </div>
                            </div>
                          </div>
                          {/* <!-- end card--> */}
                        </div>
                        {/* <!-- end col --> */}
                      </div>
                      {/* <!-- end card-body--> */}
                    </div>
                  </ClickAwayListener>

                  {/* <!-- end card--> */}
                </div>
                {/* <!-- end col --> */}
              </div>
            </div>
            {/* <!-- end row --> */}
            {/* <!-- container --> */}
          </div>
          {/* <!-- content --> */}
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
          {/* <!-- END wrapper --> */}
          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="custom-modal"
            tabindex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h4 className="modal-title" id="myCenterModalLabel">
                    Add New Customers
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <form>
                    <div className="mb-3">
                      <label for="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="mb-3">
                      <label for="exampleInputEmail1" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Enter email"
                      />
                    </div>
                    <div className="mb-3">
                      <label for="position" className="form-label">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="position"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="mb-3">
                      <label for="category" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="category"
                        placeholder="Enter Location"
                      />
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success waves-effect waves-light"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger waves-effect waves-light"
                        data-bs-dismiss="modal"
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </div>
          {/* <!-- /.modal --> */}
          {/* <!-- Right Sidebar --> */} {/* <!-- /Right-bar --> */}
          {/* <!-- Right bar overlay--> */}
          <div className="rightbar-overlay"></div>
          {/* <!-- USER PROFILE MODAL START --> */}
          <Drawer
            anchor="right"
            open={activeDrawers}
            onClose={() => setActiveDrawers(false)}
            outSideClickClose={true}
            closeIcon={true}
            style={{
              width: "500px",
            }}
          >
            <ClickAwayListener
              onClickAway={() => {
                if (!isSmallScreen) {
                  handleOpenTooltipEdit("tooltip2", false);
                }
                if (!popOverEl) {
                  return setActiveDrawers(false);
                }
              }}
            >
              <div
                className={` ${
                  activeDropdown === "modelProfile" ? "show" : ""
                }`}
                tabindex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
                style={{
                  maxWidth: isSmallScreen ? "100%" : "400px",
                  minWidth: isSmallScreen ? "100%" : "400px",
                  width: "100%",
                }}
              >
                <div
                  className="offcanvas-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                  }}
                >
                  <h5 id="offcanvasRightLabel">{editDrawerName}</h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-light dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded={
                        activeDropdown === "modelProfileSetting"
                          ? "true"
                          : "false"
                      }
                      onClick={() => setSettingsActiveDrawer(!activeDrawer)}
                    >
                      Settings
                      <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div
                      className={
                        "dropdown-menu" + (activeDrawer ? " show" : "")
                      }
                      aria-labelledby="dropdownMenuButton"
                      style={{
                        marginLeft: "-100px",
                      }}
                    >
                      <a
                        className="dropdown-item"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAccordion({
                            accordion1: true,
                            accordion2: true,
                            accordion3: true,
                            accordion4: true,
                            accordion5: true,
                            accordion6: true,
                            accordion7: true,
                            accordion8: true,
                          });
                          setSettingsActiveDrawer(false);
                        }}
                      >
                        Expand all tabs
                      </a>
                      <a
                        className="dropdown-item"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAccordion({
                            accordion1: false,
                            accordion2: false,
                            accordion3: false,
                            accordion4: false,
                            accordion5: false,
                            accordion6: false,
                            accordion7: false,
                            accordion8: false,
                          });
                          setSettingsActiveDrawer(false);
                        }}
                      >
                        Compress Collapse all tabs
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    onClick={() => setActiveDrawers(false)}
                  ></button>
                </div>
                {/* <!-- end offcanvas-header--> */}

                <div
                  className="offcanvas-body"
                  style={{
                    overflowX: "hidden",
                  }}
                >
                  <div
                    className="user-profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "1rem",
                    }}
                  >
                    <div className="user-picture">
                      <img
                        src={
                          editDrawerAvatar &&
                          editDrawerAvatar !== "" &&
                          editDrawerAvatar !== "undefined" &&
                          !editDrawerAvatar.includes("data:image") &&
                          editDrawerAvatar !== "https://www.undefined"
                            ? editDrawerAvatar
                            : "/assets/images/users/userPlaceholder.png"
                        }
                        width="80"
                        height="80"
                      />
                    </div>
                    <div className="user-details">
                      <h4> {editDrawerName}</h4>
                      <p>{editDrawerExperience[0]?.position}</p>
                      <span
                        onClick={() => {
                          window.open(
                            `https://www.linkedin.com/in/${linkedInId}`
                          );
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <FaLinkedin
                          className="fa-brands"
                          style={{
                            color: "#0077B5",
                            fontSize: "14px",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-body">
                          <ul
                            className="nav nav-tabs"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="false"
                                className={
                                  "nav-link" +
                                  (showDrawerTab === "Profile" ? " active" : "")
                                }
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowDrawerTab("Profile")}
                              >
                                <FaCircleUser />
                                Profile
                              </a>
                            </li>
                            {/* <li className="nav-item">
                              <a
                                data-bs-toggle="tab"
                                aria-expanded="true"
                                className={
                                  "nav-link" +
                                  (showDrawerTab === "Activity"
                                    ? " active"
                                    : "")
                                }
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => setShowDrawerTab("Activity")}
                              >
                                <FaClockRotateLeft />
                                Activity
                              </a>
                            </li> */}
                          </ul>
                          <div className="tab-content">
                            {showDrawerTab === "Profile" && (
                              <div
                                className={
                                  "tab-pane" +
                                  (showDrawerTab === "Profile"
                                    ? "show active"
                                    : "")
                                }
                                id="Profile"
                              >
                                <div className="col-xl-12">
                                  <div
                                    className="accordion custom-accordion"
                                    id="custom-accordion-one"
                                  >
                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "20px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSix"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className=" text-reset d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion1
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="Emails"
                                            onClick={() =>
                                              setAccordion({
                                                accordion1:
                                                  !accordion.accordion1,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <FaEnvelope
                                              style={{
                                                marginRight: "5px",
                                                marginTop: "-3px",
                                              }}
                                            />
                                            Emails{" "}
                                            {accordion.accordion1 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>

                                      <div
                                        id=""
                                        className={
                                          "collapse" +
                                          (accordion.accordion1 ? "show" : "")
                                        }
                                        aria-labelledby="headingFour"
                                        data-bs-parent="#custom-accordion-one"
                                        style={{
                                          padding: "10px",
                                          marginTop: "-10px",
                                        }}
                                      >
                                        <div className="">
                                          <div className="edit-email">
                                            <a
                                              data-bs-toggle="modal"
                                              data-bs-target="#standard-modal"
                                              style={{
                                                fontSize: "14px",
                                                color: "rgb(0, 119, 181)",
                                                cursor: "pointer",
                                                fontWeight: 600,
                                              }}
                                              id={popOverEl}
                                              onClick={(e) => {
                                                setPopOverEl(e.currentTarget);
                                                setOpenEditPopOverDrawer(true);
                                              }}
                                            >
                                              Edit emails
                                            </a>
                                          </div>{" "}
                                          {getProfiles?.result &&
                                            getProfiles?.result?.allLeads
                                              ?.find(
                                                (profile) =>
                                                  profile._id ===
                                                  drawerProfileId
                                              )
                                              ?.emails?.map((email, index) => (
                                                <div
                                                  className=""
                                                  key={index}
                                                  style={{
                                                    backgroundColor: "#fffff",
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                    borderRadius: "30px",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <div className="direct-mail-left">
                                                    <p
                                                      style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                      }}
                                                    >
                                                      <Verified
                                                        style={{
                                                          color:
                                                            email.validationStatus ===
                                                            1
                                                              ? "yellowgreen"
                                                              : email.validationStatus ===
                                                                2
                                                              ? "#69B3FF"
                                                              : "orange",
                                                          fontSize: "18px",
                                                        }}
                                                      />
                                                      {email.email}
                                                    </p>
                                                  </div>
                                                  <div className="direct-mail-right">
                                                    <h6
                                                      style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          backgroundColor:
                                                            "#38414a",
                                                          padding: "5px 5px",
                                                          fontSize: "10px",
                                                          color: "#fff",
                                                          borderRadius: "5px",
                                                          width: "50px",
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        {email.type}{" "}
                                                      </span>
                                                      {copied &&
                                                      copiedEmail ===
                                                        email.email ? (
                                                        <FaCheckCircle
                                                          style={{
                                                            color: "green",
                                                            width: "15px",
                                                            height: "15px",
                                                            cursor: "pointer",
                                                          }}
                                                        />
                                                      ) : (
                                                        <FaCopy
                                                          style={{
                                                            color: "gray",
                                                            width: "15px",
                                                            height: "15px",
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={(e) => {
                                                            handleCopy(
                                                              e,
                                                              email
                                                            );
                                                          }}
                                                        />
                                                      )}
                                                    </h6>
                                                  </div>
                                                </div>
                                              ))}
                                          {getProfiles?.result &&
                                            getProfiles?.result?.allLeads?.find(
                                              (profile) =>
                                                profile._id === drawerProfileId
                                            )?.emails?.length === 0 && (
                                              <div
                                                className=""
                                                style={{
                                                  backgroundColor: "#fffff",
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                  borderRadius: "30px",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <div className="direct-mail-left">
                                                  <p
                                                    style={{
                                                      display: "flex",
                                                      gap: "5px",
                                                      alignItems: "center",
                                                      fontSize: "14px",
                                                      fontWeight: 700,
                                                    }}
                                                  >
                                                    <FaEnvelope
                                                      style={{
                                                        width: "16px",
                                                        height: "16px",
                                                      }}
                                                    />
                                                    No Email
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "20px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSix"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className="custom-accordion-title text-reset d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion2
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="Phones"
                                            onClick={() =>
                                              setAccordion({
                                                accordion2:
                                                  !accordion.accordion2,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <Phone
                                              style={{
                                                marginRight: "5px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            Phones{" "}
                                            {accordion.accordion2 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>

                                      <div
                                        id="Phones"
                                        className={
                                          "collapse" +
                                          (accordion.accordion2 ? "show" : "")
                                        }
                                        aria-labelledby="headingFour"
                                        data-bs-parent="#custom-accordion-one"
                                        style={{
                                          padding: "10px",
                                          marginTop: "-10px",
                                        }}
                                      >
                                        {getProfiles?.result &&
                                          getProfiles?.result?.allLeads?.map(
                                            (profile) => {
                                              if (
                                                profile?._id === drawerProfileId
                                              )
                                                return profile?.phones?.map(
                                                  (phone, index) => (
                                                    <div
                                                      className=""
                                                      key={index}
                                                      style={{
                                                        backgroundColor:
                                                          "#fffff",
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                        borderRadius: "30px",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <div
                                                        className="direct-mail-left"
                                                        style={{
                                                          display: "flex",
                                                          gap: "5px",
                                                          alignItems: "center",
                                                        }}
                                                      >
                                                        <Verified
                                                          sx={{
                                                            fontSize: "18px",
                                                            color:
                                                              phone?.type ===
                                                              "Direct"
                                                                ? "yellowgreen"
                                                                : "#69B3FF",
                                                          }}
                                                        />{" "}
                                                        <p
                                                          style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            alignItems:
                                                              "center",
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                          }}
                                                        >
                                                          {phone.phone}
                                                        </p>
                                                      </div>
                                                      <div className="direct-mail-right">
                                                        <h6
                                                          className="badge"
                                                          style={{
                                                            marginTop: "10px",
                                                            whiteSpace:
                                                              "nowrap",
                                                          }}
                                                        >
                                                          <p
                                                            style={{
                                                              display: "flex",
                                                              gap: "5px",
                                                              alignItems:
                                                                "center",
                                                              whiteSpace:
                                                                "nowrap",
                                                              marginTop:
                                                                "-10px",
                                                            }}
                                                          >
                                                            <div
                                                              style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                  "column",
                                                                gap: "2px",
                                                              }}
                                                            >
                                                              {phone?.country && (
                                                                <span
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#69B3FF",
                                                                    padding:
                                                                      "5px 5px",
                                                                    fontSize:
                                                                      "10px",
                                                                    borderRadius:
                                                                      "10px",
                                                                  }}
                                                                >
                                                                  {
                                                                    phone?.country
                                                                  }
                                                                </span>
                                                              )}{" "}
                                                              <span
                                                                style={{
                                                                  backgroundColor:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "#38414a"
                                                                      : "#6a69ff",
                                                                  padding:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "4px 5px"
                                                                      : "5px 5px",
                                                                  fontSize:
                                                                    "10px",
                                                                  borderRadius:
                                                                    phone?.type ===
                                                                    "Direct"
                                                                      ? "5px"
                                                                      : "10px",
                                                                }}
                                                              >
                                                                {phone?.type ===
                                                                "Work" ? (
                                                                  profile
                                                                    ?.company
                                                                    ?.company
                                                                ) : (
                                                                  <span
                                                                    className="badge"
                                                                    style={{
                                                                      fontSize:
                                                                        "11px",
                                                                    }}
                                                                  >
                                                                    {
                                                                      phone?.type
                                                                    }
                                                                  </span>
                                                                )}
                                                              </span>
                                                            </div>
                                                            <span
                                                              style={{
                                                                color:
                                                                  "#343a40",
                                                                fontSize:
                                                                  "10px",
                                                                padding:
                                                                  "5px 5px",
                                                              }}
                                                            >
                                                              {copied &&
                                                              copiedEmail ===
                                                                phone.phone ? (
                                                                <FaCheckCircle
                                                                  style={{
                                                                    color:
                                                                      "green",
                                                                    width:
                                                                      "15px",
                                                                    height:
                                                                      "15px",
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                />
                                                              ) : (
                                                                <FaCopy
                                                                  style={{
                                                                    color:
                                                                      "gray",
                                                                    width:
                                                                      "15px",
                                                                    height:
                                                                      "15px",
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={(
                                                                    e
                                                                  ) => {
                                                                    handleCopy(
                                                                      e,
                                                                      phone
                                                                    );
                                                                  }}
                                                                />
                                                              )}
                                                            </span>
                                                          </p>
                                                        </h6>
                                                      </div>
                                                    </div>
                                                  )
                                                );
                                            }
                                          )}
                                        {getProfiles?.result &&
                                          getProfiles?.result?.allLeads?.map(
                                            (profile) => {
                                              if (
                                                profile?._id === drawerProfileId
                                              )
                                                return (
                                                  profile?.phones?.length ===
                                                    0 && (
                                                    <div
                                                      className=""
                                                      style={{
                                                        backgroundColor:
                                                          "#fffff",
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                        borderRadius: "30px",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <div className="direct-mail-left">
                                                        <p
                                                          style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            alignItems:
                                                              "center",
                                                            fontSize: "14px",
                                                            fontWeight: 700,
                                                          }}
                                                        >
                                                          No Phone Number
                                                        </p>
                                                      </div>
                                                    </div>
                                                  )
                                                );
                                            }
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="lead-status">
                                  <div className="lead-status-left">
                                    <h5
                                      style={{
                                        fontSize: "14px",
                                      }}
                                    >
                                      <LabelImportant
                                        style={{
                                          marginRight: "5px",
                                          color: "#000",
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                      Lead Status
                                    </h5>
                                  </div>
                                  <Tooltip
                                    // onClick={(e) => {
                                    //   e.stopPropagation(); // Prevent click events from propagating
                                    //   if (!isSmallScreen) {
                                    //     handleOpenTooltipEdit("tooltip1", true); // Open tooltip on hover
                                    //   }
                                    // }}
                                    // open={
                                    //   isSmallScreen
                                    //     ? drawerProfileIdToolTip["tooltip1"]
                                    //     : drawerProfileIdToolTip["tooltip1"]
                                    // }
                                    // // onMouseEnter={() => {
                                    // //   if (!isSmallScreen) {
                                    // //     handleOpenTooltipEdit("tooltip1", true); // Open tooltip on hover
                                    // //   }
                                    // // }}
                                    // // onMouseLeave={() => {
                                    // //   if (!isSmallScreen) {
                                    // //     handleOpenTooltipEdit("tooltip1", false); // Close tooltip on mouse leave
                                    // //   }
                                    // // }}
                                    disableFocusListener
                                    disableHoverListener={isSmallScreen}
                                    disableTouchListener={isSmallScreen}
                                    title={
                                      <div className="popover__content">
                                        <div className="leading-states">
                                          <div className="leading-states-left">
                                            <h5
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              <LabelImportant
                                                style={{
                                                  color: "#000",
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                              />
                                              Lead Status
                                            </h5>
                                          </div>
                                          <div className="leading-states-right">
                                            {/* <a >Set Order</a> */}
                                          </div>
                                        </div>
                                        <div
                                          className="most-checkboxes"
                                          style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            scrollbarWidth: "thin",
                                            width: "200px",
                                          }}
                                        >
                                          {getStatus?.result?.leadsStatuses?.map(
                                            (option, index) => (
                                              <div
                                                className={`form-check mb-2 ${option.color}`}
                                                key={index}
                                              >
                                                <input
                                                  className="form-check-input"
                                                  type="radio"
                                                  name="flexRadioDefault"
                                                  id={`customradio${index + 1}`}
                                                  value={option._id}
                                                  checked={
                                                    selectedLeadStatusId[
                                                      getProfiles?.result?.folderProfiles?.find(
                                                        (profile) =>
                                                          profile._id ===
                                                          drawerProfileId
                                                      )
                                                    ] === option._id ||
                                                    getProfiles?.result?.folderProfiles?.find(
                                                      (profile) =>
                                                        profile._id ===
                                                        drawerProfileId
                                                    )?.status?._id ===
                                                      option._id
                                                  }
                                                  onChange={(e) => {
                                                    handleChange(
                                                      e,
                                                      editDrawerProfile
                                                    );
                                                  }}
                                                />
                                                <label
                                                  className="form-check-label"
                                                  htmlFor={`customradio${
                                                    index + 1
                                                  }`}
                                                >
                                                  {option.name}
                                                </label>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    }
                                    placement="left"
                                    arrow
                                    PopperProps={{
                                      modifiers: [
                                        {
                                          name: "offset",
                                          options: {
                                            offset: [-100, -24],
                                          },
                                        },
                                      ],
                                      sx: {
                                        "& .MuiTooltip-tooltip": {
                                          backgroundColor: "#fff",
                                          color: "white",
                                          boxShadow:
                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                        },
                                        "& .MuiTooltip-arrow": {
                                          color: "#f4f4f4",
                                        },
                                      },
                                    }}
                                  >
                                    {getProfiles?.result?.allLeads?.find(
                                      (profile) =>
                                        profile._id === drawerProfileId
                                    )?.status?.name ? (
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#lead-modal"
                                        onClick={
                                          isSmallScreen
                                            ? (e) => {
                                                e.stopPropagation();
                                                handleOpenTooltipEdit(
                                                  "tooltip1",
                                                  !drawerProfileIdToolTip[
                                                    "tooltip1"
                                                  ]
                                                ); // Toggle tooltip on click
                                              }
                                            : undefined
                                        }
                                      >
                                        <div
                                          className="added-by "
                                          style={{
                                            backgroundColor: "#fffff",
                                            padding: "0px 10px",
                                            borderRadius: "30px",
                                          }}
                                        >
                                          <h6
                                            style={{
                                              display: "flex",
                                              gap: "5px",
                                              alignItems: "center",
                                              fontSize: "14px",
                                              padding: "10px 10px",
                                            }}
                                          >
                                            <LabelImportant
                                              style={{
                                                color:
                                                  getProfiles?.result?.allLeads?.find(
                                                    (profile) =>
                                                      profile._id ===
                                                      drawerProfileId
                                                  )?.status?.color,
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            {
                                              getProfiles?.result?.allLeads?.find(
                                                (profile) =>
                                                  profile._id ===
                                                  drawerProfileId
                                              )?.status?.name
                                            }
                                          </h6>
                                        </div>
                                      </a>
                                    ) : (
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#lead-modal"
                                        onClick={
                                          isSmallScreen
                                            ? (e) => {
                                                e.stopPropagation();
                                                handleOpenTooltipEdit(
                                                  "tooltip1",
                                                  !drawerProfileIdToolTip[
                                                    "tooltip1"
                                                  ]
                                                ); // Toggle tooltip on click
                                              }
                                            : undefined
                                        }
                                      >
                                        <div
                                          className="added-by "
                                          style={{
                                            backgroundColor: "#fffff",
                                            padding: "5px 10px",
                                            borderRadius: "30px",
                                          }}
                                        >
                                          <h6
                                            style={{
                                              display: "flex",
                                              gap: "5px",
                                              alignItems: "center",
                                              fontSize: "14px",
                                            }}
                                          >
                                            <LabelImportant
                                              style={{
                                                color: "#000",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            Add Tag
                                          </h6>
                                        </div>
                                      </a>
                                    )}
                                  </Tooltip>
                                </div>

                                <div className="lead-status">
                                  <div className="lead-status-left">
                                    <h5
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <FaCircleRight />
                                      Tags
                                    </h5>
                                  </div>
                                  <Tooltip
                                    // onClick={(e) => {
                                    //   e.stopPropagation(); // Prevent click events from propagating
                                    // }}
                                    // open={
                                    //   isSmallScreen
                                    //     ? drawerProfileIdToolTip["tooltip3"]
                                    //     : drawerProfileIdToolTip["tooltip3"]
                                    // }
                                    // onMouseEnter={() => {
                                    //   if (!isSmallScreen) {
                                    //     handleOpenTooltipEdit("tooltip3", true); // Open tooltip on hover
                                    //   }
                                    // }}
                                    // onMouseLeave={() => {
                                    //   if (!isSmallScreen) {
                                    //     handleOpenTooltipEdit("tooltip3", false); // Close tooltip on mouse leave
                                    //   }
                                    // }}
                                    disableFocusListener
                                    disableHoverListener={isSmallScreen} // Disable hover on small screens
                                    disableTouchListener={isSmallScreen} // Disable touch on small screens
                                    title={
                                      <div className="popover__content">
                                        <div className="add-our-tags">
                                          {getTags?.result.length === 0 ? (
                                            <>
                                              <img src="assets/images/users/projects-empty-state.svg" />
                                              <p>
                                                Organize your contacts in tags
                                              </p>
                                              <button
                                                type="button"
                                                className="btn btn-add"
                                                onClick={(e) => {
                                                  handleEditFolderName();
                                                  setTagIds(profile._id);
                                                  setAnchorElId(
                                                    e.currentTarget
                                                  );
                                                }}
                                              >
                                                {" "}
                                                Create your first Tag
                                              </button>
                                            </>
                                          ) : addTag ? (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "10px",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  display: "flex",
                                                  gap: "5px",
                                                  alignItems: "center",
                                                  fontSize: "18px",
                                                }}
                                              >
                                                <Label
                                                  style={{
                                                    color: "#000",
                                                    width: "20px",
                                                    height: "20px",
                                                  }}
                                                />
                                                Tags
                                              </Typography>
                                              <Divider
                                                sx={{
                                                  backgroundColor: "#f4f4f4",
                                                }}
                                              />
                                              <TextField
                                                id="outlined-basic"
                                                label="Search tags"
                                                variant="outlined"
                                                value={tagSearch}
                                                onChange={(e) =>
                                                  setTagSearch(e.target.value)
                                                }
                                                sx={{
                                                  width: "100%",
                                                  fontSize: "10px",
                                                  "& .MuiOutlinedInput-root": {
                                                    height: "45px",
                                                    padding: " 10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                  },
                                                }}
                                              />
                                              <Divider
                                                sx={{
                                                  backgroundColor: "#f4f4f4",
                                                }}
                                              />
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  height: "200px",
                                                  overflowY: "auto",
                                                  lineHeight: "1",
                                                }}
                                              >
                                                {getTags?.result?.map((tag) => (
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: "5px",
                                                      alignItems: "center",
                                                    }}
                                                    key={tag?._id}
                                                  >
                                                    <Checkbox
                                                      checked={
                                                        getProfiles?.result?.allLeads
                                                          ?.find(
                                                            (profile) =>
                                                              profile._id ===
                                                              drawerProfileId
                                                          )
                                                          ?.tags?.findIndex(
                                                            (t) =>
                                                              t._id === tag._id
                                                          ) > -1
                                                      }
                                                      onChange={handleCheckboxChangeDrawer(
                                                        tag
                                                      )}
                                                    />
                                                    <p>{tag?.name}</p>
                                                  </Box>
                                                ))}
                                              </Box>
                                              <Divider
                                                sx={{
                                                  backgroundColor: "#f4f4f4",
                                                }}
                                              />
                                              <Button
                                                variant="contained"
                                                sx={{
                                                  backgroundColor: "#f4f4f4",
                                                  color: "#000",
                                                  textTransform: "capitalize",
                                                  "&:hover": {
                                                    backgroundColor: "#f4f4f4",
                                                  },
                                                }}
                                                onClick={() => {
                                                  setAddTag(false);
                                                }}
                                              >
                                                + New tag
                                              </Button>
                                            </Box>
                                          ) : (
                                            <div className="modal-dialog modal-dialog-centered modal-sm">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  {/* back button */}

                                                  <h1
                                                    className="modal-title fs-5"
                                                    style={{
                                                      whiteSpace: "nowrap",
                                                      width: "100%",
                                                      fontWeight: 600,
                                                      fontSize: "14px",
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <ChevronLeft
                                                      onClick={() => {
                                                        setAddTag(true);
                                                      }}
                                                      sx={{
                                                        color: "#000",
                                                        cursor: "pointer",
                                                        fontSize: "20px",
                                                        marginRight: "10px",
                                                      }}
                                                    />
                                                    New Tag
                                                  </h1>
                                                  <hr />
                                                </div>
                                                <div className="modal-body">
                                                  <form>
                                                    <div className="mb-2">
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        placeholder="Tage Name"
                                                        value={editName}
                                                        onChange={(e) => {
                                                          setEditName(
                                                            e.target.value
                                                          );
                                                        }}
                                                      />
                                                    </div>

                                                    <div className="color-option mb-3">
                                                      <h5
                                                        style={{
                                                          fontWeight: 600,
                                                          marginBottom: "10px",
                                                          textAlign: "left",
                                                        }}
                                                      >
                                                        Set Color
                                                      </h5>
                                                      <div className="d-flex flex-wrap">
                                                        {colorPalette.map(
                                                          (color, index) => (
                                                            <Box
                                                              key={index}
                                                              sx={{
                                                                width: 24,
                                                                height: 24,
                                                                backgroundColor:
                                                                  color,
                                                                borderRadius:
                                                                  "50%",
                                                                margin: 0.5,
                                                                cursor:
                                                                  "pointer",
                                                                border:
                                                                  editColor ===
                                                                  color
                                                                    ? "2px solid #000"
                                                                    : "2px solid transparent",
                                                              }}
                                                              onClick={(e) => {
                                                                setEditColor(
                                                                  color
                                                                );
                                                              }}
                                                            />
                                                          )
                                                        )}
                                                      </div>
                                                      {/* <div className="mt-2">
                                                                                    Selected Color: {selectedColor}
                                                                                  </div> */}
                                                    </div>

                                                    <div className="  d-md-flex justify-content-md-end">
                                                      <button
                                                        className="btn btn-secondary "
                                                        style={{
                                                          backgroundColor:
                                                            "#000",
                                                          color: "#fff",
                                                          backgroundColor:
                                                            "#000",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          width: "100px",
                                                          whiteSpace: "nowrap",
                                                        }}
                                                        type="button"
                                                        onClick={
                                                          handleCreateTags
                                                        }
                                                      >
                                                        Create Tag
                                                      </button>
                                                    </div>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    }
                                    placement="left"
                                    arrow
                                    PopperProps={{
                                      modifiers: [
                                        {
                                          name: "offset",
                                          options: {
                                            offset: [-200, -80],
                                          },
                                        },
                                      ],
                                      sx: {
                                        "& .MuiTooltip-tooltip": {
                                          backgroundColor: "#fff",
                                          color: "white",
                                          boxShadow:
                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                        },
                                        "& .MuiTooltip-arrow": {
                                          color: "#f4f4f4",
                                        },
                                      },
                                    }}
                                  >
                                    <a
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "2px",
                                        padding: "5px 10px",
                                      }}
                                      onClick={
                                        isSmallScreen
                                          ? (e) => {
                                              e.stopPropagation();
                                              handleOpenTooltipEdit(
                                                "tooltip3",
                                                !drawerProfileIdToolTip[
                                                  "tooltip3"
                                                ]
                                              ); // Toggle tooltip on click
                                            }
                                          : undefined
                                      }
                                    >
                                      {getProfiles?.result?.allLeads?.map(
                                        (tags) => {
                                          if (drawerProfileId === tags._id) {
                                            return tags.tags.length > 0 ? (
                                              tags?.tags?.map((tag) => (
                                                <div
                                                  className=""
                                                  key={tag._id}
                                                  style={{
                                                    width: "100%",
                                                    border: "1px solid #ADADAD",
                                                    borderRadius: "30px",
                                                    padding: "0px 10px",
                                                  }}
                                                >
                                                  <p
                                                    style={{
                                                      display: "flex",
                                                      gap: "5px",
                                                      alignItems: "center",
                                                      fontSize: "14px",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                    id={anchorElId}
                                                  >
                                                    <FaTag
                                                      style={{
                                                        color: `${tag?.color}`,
                                                        width: "15px",
                                                        height: "15px",
                                                      }}
                                                    />
                                                    {tag.name}
                                                  </p>
                                                </div>
                                              ))
                                            ) : (
                                              <div className="popover__title">
                                                <p
                                                  id={anchorElId}
                                                  style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                    alignItems: "center",
                                                    padding: "5px 10px",
                                                  }}
                                                  onClick={(e) => {
                                                    setAnchorElId(
                                                      e.currentTarget
                                                    );
                                                  }}
                                                >
                                                  <FaFileLines
                                                    style={{
                                                      color: "#000",
                                                      width: "15px",
                                                      height: "15px",
                                                    }}
                                                  />
                                                  Add tag
                                                </p>
                                              </div>
                                            );
                                          }
                                        }
                                      )}
                                    </a>
                                  </Tooltip>
                                </div>

                                {/* <div
                                  className="lead-status"
                                  style={{
                                    padding: "15px 10px",
                                  }}
                                >
                                  <div className="lead-status-left">
                                    <h5
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <FaUserGroup />
                                      Assigned to
                                    </h5>
                                  </div>
                                  <Tooltip
                                    title={
                                      <div className="popover__content">
                                        <div className="popover-zindex">
                                          <div className="assign-tittles">
                                            <h4
                                              style={{
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                                fontSize: "14px",
                                              }}
                                            >
                                              <FaUserGroup
                                                style={{
                                                  color: "#000",
                                                  width: "20px",
                                                  height: "20px",
                                                }}
                                              />
                                              Assigned To
                                            </h4>
                                          </div>
                                          <div className="search-name">
                                            <form className="search-bar">
                                              <div className="position-relative">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Enter teammate name"
                                                />
                                                <span className="mdi mdi-magnify"></span>
                                              </div>
                                            </form>
                                          </div>
                                          <div className="lead-teama">
                                            <div className="form-check form-check-success lead-sucy">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value=""
                                                id="customckeck2"
                                              />
                                              <label
                                                className="form-check-label user-imf"
                                                for="customckeck2"
                                              >
                                                <img
                                                  src="assets/images/users/user-3.jpg"
                                                  width="30"
                                                  height="30"
                                                />
                                              </label>
                                              <label
                                                className="form-check-label"
                                                for="customckeck2"
                                              >
                                                Hamid Ali
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    disableFocusListener
                                    disableTouchListener
                                    placement="bottom-start"
                                    arrow
                                    PopperProps={{
                                      modifiers: [
                                        {
                                          name: "offset",
                                          options: {
                                            offset: [-150, -14],
                                          },
                                        },
                                      ],
                                      sx: {
                                        "& .MuiTooltip-tooltip": {
                                          backgroundColor: "#fff",
                                          color: "white",
                                          boxShadow:
                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                        },
                                        "& .MuiTooltip-arrow": {
                                          color: "#f4f4f4",
                                        },
                                      },
                                    }}
                                  >
                                    <a>
                                      <div className="popover__title">
                                        <p
                                          style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center",
                                            fontSize: "14px",
                                            padding: "0px 10px",
                                          }}
                                        >
                                          <FaUser
                                            style={{
                                              color: "#000",
                                              width: "15px",
                                              height: "15px",
                                            }}
                                          />
                                          Assign to teammate
                                        </p>
                                      </div>
                                    </a>{" "}
                                  </Tooltip>
                                </div> */}

                                <div className="lead-status">
                                  <div className="lead-status-left">
                                    <h5
                                      style={{
                                        display: "flex",
                                        gap: "5px",
                                        alignItems: "center",
                                        fontSize: "14px",
                                      }}
                                    >
                                      <Notes
                                        style={{
                                          color: "#000",
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                      Notes
                                    </h5>
                                  </div>
                                  <Tooltip
                                    // onClick={(e) => {
                                    //   e.stopPropagation(); // Prevent click events from propagating
                                    //   if (!isSmallScreen) {
                                    //     handleOpenTooltipEdit("tooltip2", true); // Open tooltip on hover
                                    //   }
                                    // }}
                                    // open={
                                    //   isSmallScreen
                                    //     ? drawerProfileIdToolTip["tooltip2"]
                                    //     : drawerProfileIdToolTip["tooltip2"]
                                    // }
                                    // // isOpen={drawerProfileIdToolTip["tooltip2"]}
                                    // // // onClick={() => {
                                    // // // }}
                                    // // onClose={() => {
                                    // //   if (!isSmallScreen) {
                                    // //     handleOpenTooltipEdit("tooltip2", false); // Close tooltip on mouse leave
                                    // //   }
                                    // // }}
                                    disableFocusListener
                                    disableHoverListener={isSmallScreen} // Disable hover on small screens
                                    disableTouchListener={isSmallScreen} // Disable touch on small screens
                                    title={
                                      <div className="popover__content">
                                        <div className="add-our-tags">
                                          {getProfiles?.result?.allLeads?.find(
                                            (profile) =>
                                              profile._id === drawerProfileId
                                          )?.notes <= 0 ? (
                                            <div className="add-our-tags">
                                              <img src="assets/images/users/notes-empty-state.svg" />
                                              <p>
                                                Add notes to your contacts to
                                                never forget details.
                                              </p>
                                              <div className="mb-3">
                                                <textarea
                                                  className="form-control"
                                                  rows="3"
                                                  placeholder="Type a note"
                                                  value={note}
                                                  onChange={(e) =>
                                                    setNote(e.target.value)
                                                  }
                                                />
                                              </div>
                                              {/* <button
                                              type="button"
                                              className="btn btn-cancel"
                                            >
                                              Cancel
                                            </button> */}
                                              <button
                                                type="button"
                                                className="btn btn-note"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleAddNote(
                                                    editDrawerProfile
                                                  );
                                                }}
                                                disabled={
                                                  !note || updateTagLoading
                                                }
                                              >
                                                Add Note
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="add-our-tags">
                                              <div
                                                className="add-note"
                                                style={{
                                                  display: "flex",
                                                  alignItems: "flex-start",
                                                }}
                                              >
                                                <h5>
                                                  <FaGripHorizontal
                                                    style={{
                                                      color: "#000",
                                                      width: "20px",
                                                      height: "20px",
                                                      marginRight: "10px",
                                                    }}
                                                  />
                                                  Notes
                                                </h5>
                                              </div>
                                              <div
                                                className="note-list"
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  paddingRight: "30px",
                                                  maxWidth: "250px",
                                                  height: "200px",
                                                  overflowY: "auto",
                                                  marginBottom: "10px",
                                                }}
                                              >
                                                <ul
                                                  style={{
                                                    listStyle: "none",
                                                    color: "#000",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginTop: "30px",
                                                  }}
                                                >
                                                  {getProfiles?.result?.allLeads
                                                    ?.find(
                                                      (profile) =>
                                                        profile._id ===
                                                        drawerProfileId
                                                    )
                                                    ?.notes?.map((note) => (
                                                      <li
                                                        key={note}
                                                        style={{
                                                          marginBottom: "20px",
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          alignItems:
                                                            "flex-start",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            fontSize: "12px",
                                                            color: "gray",
                                                            marginBottom: "0px",
                                                            lineHeight: "1",
                                                          }}
                                                        >
                                                          {
                                                            auth?.result
                                                              ?.firstName
                                                          }{" "}
                                                          -{" "}
                                                          {new Date(
                                                            editDrawerCreated
                                                          ).toLocaleDateString({
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                          })}
                                                        </div>
                                                        <div
                                                          style={{
                                                            lineHeight: "2",
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          {note}
                                                        </div>
                                                      </li>
                                                    ))}
                                                </ul>
                                              </div>
                                              <div className="mb-3">
                                                <input
                                                  className="form-control"
                                                  rows="3"
                                                  placeholder="Type a note"
                                                  value={note}
                                                  onChange={(e) =>
                                                    setNote(e.target.value)
                                                  }
                                                  onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                      handleAddNote(
                                                        editDrawerProfile
                                                      );
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    }
                                    placement="left"
                                    arrow
                                    PopperProps={{
                                      modifiers: [
                                        {
                                          name: "offset",
                                          options: { offset: [-150, -80] },
                                        },
                                      ],
                                      sx: {
                                        "& .MuiTooltip-tooltip": {
                                          backgroundColor: "#fff",
                                          color: "white",
                                          boxShadow:
                                            "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
                                        },
                                        "& .MuiTooltip-arrow": {
                                          color: "#f4f4f4",
                                        },
                                      },
                                    }}
                                  >
                                    <a
                                      onClick={
                                        isSmallScreen
                                          ? (e) => {
                                              e.stopPropagation();
                                              handleOpenTooltipEdit(
                                                "tooltip2",
                                                !drawerProfileIdToolTip[
                                                  "tooltip2"
                                                ]
                                              ); // Toggle tooltip on click
                                            }
                                          : undefined
                                      }
                                    >
                                      {editDrawerNotes?.length > 0 ? (
                                        <div
                                          className="popover__title"
                                          key={note}
                                          style={{
                                            display: "flex",
                                            gap: "5px",
                                            alignItems: "center",
                                            fontSize: "14px",
                                            padding: "0px 10px",
                                          }}
                                        >
                                          <FaFileLines
                                            style={{
                                              color: "#000",
                                              width: "15px",
                                              height: "15px",
                                            }}
                                          />
                                          {editDrawerNotes[0]}
                                        </div>
                                      ) : (
                                        <div className="popover__title">
                                          <p
                                            style={{
                                              display: "flex",
                                              gap: "5px",
                                              alignItems: "center",
                                              padding: "0px 10px",
                                            }}
                                          >
                                            <FaFileLines
                                              style={{
                                                color: "#000",
                                                width: "15px",
                                                height: "15px",
                                              }}
                                            />
                                            Add note
                                          </p>
                                        </div>
                                      )}
                                    </a>
                                  </Tooltip>
                                </div>

                                <div className="col-xl-12">
                                  <div
                                    className="accordion custom-accordion"
                                    id="custom-accordion-one"
                                  >
                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "20px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSix"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className="custom-accordion-title text-reset collapsed d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion3
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="contactDetails"
                                            onClick={() =>
                                              setAccordion({
                                                accordion3:
                                                  !accordion.accordion3,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <Ballot
                                              style={{
                                                marginRight: "5px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            Contact Details{" "}
                                            {accordion.accordion3 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>
                                      <div
                                        id="contactDetails"
                                        className={
                                          "collapse" +
                                          (accordion.accordion3 ? "show" : "")
                                        }
                                        aria-labelledby="headingSix"
                                        data-bs-parent="#custom-accordion-one"
                                      >
                                        <div className="card-body">
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "20px",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                flexDirection: "column",
                                                gap: "10px",
                                              }}
                                            >
                                              {/* <p
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: 300,
                                                color: "#000",
                                              }}
                                            >
                                              INDUSTRY  
                                            </p> */}
                                              <p
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: 300,
                                                  color: "#000",
                                                }}
                                              >
                                                LOCATION
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: "12px",
                                                  fontWeight: 300,
                                                  color: "#000",
                                                }}
                                              >
                                                ADDED
                                              </p>
                                            </Box>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                flexDirection: "column",
                                                gap: "10px",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                  color: "#000",
                                                }}
                                              >
                                                <FaMapMarkerAlt />

                                                {editDrawerCountry}
                                              </p>
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  fontWeight: 500,
                                                  color: "#000",
                                                  display: "flex",
                                                  gap: "4px",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <FaCalendarAlt />
                                                {daysAgo(editDrawerCreated)}
                                              </p>
                                            </Box>
                                          </Box>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "20px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSeven"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className="custom-accordion-title text-reset collapsed d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion4
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="aboutDetail"
                                            onClick={() =>
                                              setAccordion({
                                                accordion4:
                                                  !accordion.accordion4,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <Article
                                              style={{
                                                marginRight: "5px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            About{" "}
                                            {accordion.accordion4 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>
                                      <div
                                        id="aboutDetail"
                                        className={
                                          "collapse" +
                                          (accordion.accordion4 ? "show" : "")
                                        }
                                        aria-labelledby="headingSeven"
                                        data-bs-parent="#custom-accordion-one"
                                      >
                                        <div
                                          className="card-body"
                                          style={{
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            color: "#000",
                                          }}
                                        >
                                          {editDrawerAbout.length > 80 ? (
                                            <p>
                                              {!readMore
                                                ? editDrawerAbout.substring(
                                                    0,
                                                    140
                                                  )
                                                : editDrawerAbout}
                                              <span
                                                style={{
                                                  color: "blue",
                                                  cursor: "pointer",
                                                  fontSize: "14px",
                                                }}
                                                onClick={() => {
                                                  setReadMore(!readMore);
                                                }}
                                              >
                                                {readMore
                                                  ? "...Read Less"
                                                  : "...Read More"}
                                              </span>
                                            </p>
                                          ) : (
                                            editDrawerAbout
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "20px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSix"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className="custom-accordion-title text-reset collapsed d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion5
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="experienceDetail"
                                            onClick={() =>
                                              setAccordion({
                                                accordion5:
                                                  !accordion.accordion5,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <WorkOutline
                                              style={{
                                                marginRight: "5px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            Experience{" "}
                                            {accordion.accordion5 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>
                                      <div
                                        id="experienceDetail"
                                        className={
                                          "collapse" +
                                          (accordion.accordion5 ? "show" : "")
                                        }
                                        aria-labelledby="headingeight"
                                        data-bs-parent="#custom-accordion-one"
                                      >
                                        <div className="card-body">
                                          {editDrawerExperience &&
                                            editDrawerExperience.length > 0 &&
                                            editDrawerExperience?.map((exp) => (
                                              <div
                                                className="experience-box"
                                                key={exp._id}
                                                style={{
                                                  display: "flex",
                                                  gap: "10px",
                                                  alignItems: "flex-start",
                                                  marginTop: "30px",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    exp.imageSrc &&
                                                    exp.imageSrc !==
                                                      "https://www.undefined"
                                                      ? exp.imageSrc
                                                      : "/assets/images/logocom.png"
                                                  }
                                                  alt=""
                                                  width="50"
                                                  height="50"
                                                />
                                                <div className="experience-box-right">
                                                  <h4
                                                    style={{
                                                      fontSize: "16px",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {exp.position}
                                                  </h4>
                                                  <p
                                                    style={{
                                                      fontSize: "13px",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {exp.company}
                                                  </p>
                                                  <p
                                                    style={{
                                                      fontSize: "14px",
                                                      fontWeight: 400,
                                                      lineHeight: "1",
                                                    }}
                                                  >
                                                    {exp.duration}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className="card mb-0"
                                      style={{
                                        borderBottom: "1px solid #D3D3D3",
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: "30px 10px",
                                          cursor: "pointer",
                                        }}
                                        id="headingSix"
                                      >
                                        <h5 className="m-0 position-relative">
                                          <a
                                            className="custom-accordion-title text-reset collapsed d-block"
                                            data-bs-toggle="collapse"
                                            aria-expanded={
                                              accordion.accordion6
                                                ? "true"
                                                : "false"
                                            }
                                            aria-controls="educationDetail"
                                            onClick={() =>
                                              setAccordion({
                                                accordion6:
                                                  !accordion.accordion6,
                                              })
                                            }
                                            style={{
                                              fontSize: "14px",
                                            }}
                                          >
                                            <School
                                              style={{
                                                marginRight: "5px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                            Education{" "}
                                            {accordion.accordion6 ? (
                                              <BiChevronDown className="accordion-arrow" />
                                            ) : (
                                              <MdChevronRight className="accordion-arrow" />
                                            )}
                                          </a>
                                        </h5>
                                      </div>
                                      <div
                                        id="educationDetail"
                                        className={
                                          "collapse" +
                                          (accordion.accordion6 ? "show" : "")
                                        }
                                        aria-labelledby="headingeight"
                                        data-bs-parent="#custom-accordion-one"
                                      >
                                        <div className="card-body">
                                          {editDrawerEducation &&
                                            editDrawerEducation?.length > 0 &&
                                            editDrawerEducation?.map((exp) => (
                                              <div
                                                className="experience-box"
                                                key={exp._id}
                                                style={{
                                                  display: "flex",
                                                  gap: "10px",
                                                  alignItems: "flex-start",
                                                  marginTop: "30px",
                                                }}
                                              >
                                                <img
                                                  src={
                                                    exp.imageSrc &&
                                                    exp.imageSrc !==
                                                      "https://www.undefined"
                                                      ? exp.imageSrc
                                                      : "/assets/images/logocom.png"
                                                  }
                                                  alt=""
                                                  width="50"
                                                  height="50"
                                                />
                                                <div className="experience-box-right">
                                                  <h4
                                                    style={{
                                                      fontSize: "16px",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {exp.uniName}
                                                  </h4>
                                                  <p
                                                    style={{
                                                      fontSize: "13px",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {exp.educationLevel}
                                                  </p>
                                                  <p
                                                    style={{
                                                      fontSize: "14px",
                                                      fontWeight: 400,
                                                      lineHeight: "1",
                                                    }}
                                                  >
                                                    {exp.educationDuration}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {showDrawerTab === "Activity" && (
                              <div
                                className={
                                  "tab-pane" +
                                  (showDrawerTab === "Activity"
                                    ? "show active"
                                    : "")
                                }
                                id="Activity"
                              >
                                <p>
                                  Donec pede justo, fringilla vel, aliquet nec,
                                  vulputate eget, arcu. In enim justo, rhoncus
                                  ut, imperdiet a, venenatis vitae, justo.
                                  Nullam dictum felis eu pede mollis pretium.
                                  Integer tincidunt.Cras dapibus. Vivamus
                                  elementum semper nisi. Aenean vulputate
                                  eleifend tellus. Aenean leo ligula, porttitor
                                  eu, consequat vitae, eleifend ac, enim.
                                </p>
                                <p className="mb-0">
                                  Vakal text here dolor sit amet, consectetuer
                                  adipiscing elit. Aenean commodo ligula eget
                                  dolor. Aenean massa. Cum sociis natoque
                                  penatibus et magnis dis parturient montes,
                                  nascetur ridiculus mus. Donec quam felis,
                                  ultricies nec, pellentesque eu, pretium quis,
                                  sem. Nulla consequat massa quis enim.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <!-- end card--> */}
                    </div>
                    {/* <!-- end col --> */}
                  </div>
                </div>
                {/* <!-- end offcanvas-body--> */}
              </div>
            </ClickAwayListener>
          </Drawer>
          {/* <!-- end offcanvas--> */}
          {/* <!-- Standard modal content --> */}
          <div
            id="standard-modal"
            className="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="standard-modalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="standard-modalLabel">
                    Emails
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="email-form">
                    <div className="mb-3">
                      <label for="example-email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="example-email"
                        name="example-email"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>
                    <a>+ Add Email</a>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </div>
          {/* <!-- /.modal --> */}
          {/* <!-- company modal content --> */}
          <div
            id="company-modal"
            className="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="company-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="company-modal">
                    Company Details
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="comapy-detail">
                    <div className="company-top-deal">
                      <div className="company-top-deal-left">
                        <img src="assets/images/users/wm-search-group.png" />
                      </div>
                      <div className="company-top-deal-right">
                        <h5>WM Search Group</h5>
                        <p></p>
                      </div>
                    </div>
                    <div className="company-btm-deal">
                      <ul>
                        <li>
                          Founded <span>2014</span>
                        </li>
                        <li>
                          Industry <span>Chemicals</span>
                        </li>
                        <li>
                          Social Media{" "}
                          <a>
                            <i className="fa-brands fa-linkedin"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </div>
          {/* <!-- /.modal --> */}
          {/* <!-- company modal content --> */}
          <div
            id="lead-modal"
            className="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="lead-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="lead-modal">
                    Lead Status
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio1"
                          checked
                        />
                        <label className="form-check-label" for="customradio1">
                          Added
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-success">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio2"
                        />
                        <label className="form-check-label" for="customradio2">
                          Contacted
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-info">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio3"
                        />
                        <label className="form-check-label" for="customradio3">
                          Connected
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-danger">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio4"
                        />
                        <label className="form-check-label" for="customradio4">
                          In Progress
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-warning">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio5"
                        />
                        <label className="form-check-label" for="customradio5">
                          Won
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-primary">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio6"
                        />
                        <label className="form-check-label" for="customradio6">
                          Unqualified
                        </label>
                      </div>

                      <div className="form-check mb-2 form-check-pink">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="customradio7"
                        />
                        <label className="form-check-label" for="customradio7">
                          Lost
                        </label>
                      </div>
                    </div>
                    {/* <!-- end col --> */}
                  </div>
                  {/* <!-- end row--> */}
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </div>
          {/* <!-- /.modal --> */}
          {/* <!-- PHONE modal content --> */}
          <div
            id="phone-modal"
            className="modal fade"
            tabindex="-1"
            role="dialog"
            aria-labelledby="phone-modal"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="phone-modal">
                    Scott's phones
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mobile-teals">
                    <div className="mobile-teals-left">
                      <p>
                        <i className="fa-solid fa-circle-check"></i> +1
                        608-212-8833
                      </p>
                    </div>
                    <div className="mobile-teals-right">
                      <h6>
                        Direct{" "}
                        <a>
                          <i className="fa-solid fa-copy"></i>
                        </a>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- /.modal-content --> */}
            </div>
            {/* <!-- /.modal-dialog --> */}
          </div>
          {/* <!-- /.modal --> */}
        </div>
      </div>
      <div
        className={"modal fade" + (newView === true ? " show" : "")}
        id="new-view"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myLargeModalLabel"
        aria-hidden="true"
        style={{
          display: newView === true ? "block" : "none",
        }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                className="modal-title"
                id="myLargeModalLabel"
                style={{
                  fontWeight: "bold",
                }}
              >
                New View
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setNewView(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="crate-form">
                      <form>
                        <div className="mb-3">
                          <input
                            type="text"
                            id="simpleinput"
                            className="form-control"
                          />
                        </div>
                      </form>
                      <div className="tempalre-create">
                        <h4
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Template
                        </h4>
                        <div className="tempalre-create-main">
                          <div className="tempalre-create-main-left">
                            <FaSquarePollHorizontal
                              style={{
                                color: "#008044",
                                fontSize: "25px",
                              }}
                            />
                            <p>Sales</p>
                          </div>
                          <div className="tempalre-create-main-right">
                            <FaSquarePollHorizontal
                              style={{
                                color: "#6658dd",
                                fontSize: "25px",
                              }}
                            />{" "}
                            <p>Recruitment</p>
                          </div>
                        </div>
                      </div>
                      <div className="create-btn-new d-grid">
                        <button
                          type="button"
                          className="btn btn-dark waves-effect waves-light"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="template-video">
                      <img
                        src="https://d2ds8yldqp7gxv.cloudfront.net/lead/contact-export.svg"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Advance filter  */}
      <Drawer
        anchor="right"
        open={activeDropdownMore}
        onClose={() => {
          setActiveDropdownMore(false);
        }}
        className=" "
        tabindex="-1"
        id="addvancedFilter"
        aria-labelledby="addvancedFilter"
        style={{
          width: "540px",
          padding: "20px",
          height: "30vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="offcanvas-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <h5
            style={{
              fontWeight: "bold",
            }}
            id="addvancedFilter"
          >
            <FaArrowUpWideShort
              style={{
                marginRight: "10px",
              }}
            />
            Advanced Filters
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setActiveDropdownMore(false);
            }}
          ></button>
        </div>
        <div
          className="offcanvas-body"
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            className="contact-matching"
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <p>Contacts matching</p>
            <select
              className="form-select"
              style={{
                width: "100px",
              }}
              value={matchingValue}
              onChange={(e) => setMatchingValue(e.target.value)}
            >
              {matchingData.map((data) => (
                <option value={data.value} key={data.value}>
                  {data.name}
                </option>
              ))}
            </select>
            <p
              style={{
                fontSize: "14px",
                color: "#6c757d",
              }}
            >
              of the following conditions
            </p>
          </div>
          <div className="advances-forms">
            <form onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <div className="row" key={index}>
                  <div className="mb-3 col-md-4">
                    <div className="d-flex align-items-center">
                      <span
                        style={{
                          marginRight: "10px",
                          color: "#f00",
                          cursor: "pointer",
                        }}
                        onClick={() => handleRemoveFieldDrawer(index)}
                      >
                        <FaMinusCircle />
                      </span>

                      <select
                        id="inputState"
                        className="form-select"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldChange(index, "name", e.target.value)
                        }
                        style={{
                          height: "55px",
                        }}
                      >
                        {selectData.map((data) => (
                          <option value={data.value} key={data.value}>
                            {data.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3 col-md-4">
                    <select
                      id="inputState"
                      className="form-select"
                      value={field.operator}
                      onChange={(e) =>
                        handleFieldChange(index, "operator", e.target.value)
                      }
                      style={{
                        height: "55px",
                      }}
                    >
                      {field.name === "tag" || field.name === "leadStatus"
                        ? tagANdLeadStatusSelection.map((data) => (
                            <option value={data.value} key={data.value}>
                              {data.name}
                            </option>
                          ))
                        : optionsSelection.map((data, index) => (
                            <option value={data.value} key={data.value}>
                              {data.name}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div className="mb-3 col-md-4">
                    {field?.name === "tag" ? (
                      <Autocomplete
                        multiple
                        id="tags-filled"
                        options={getTags?.result || []}
                        getOptionLabel={(option) => option.name}
                        value={
                          Array.isArray(field.value)
                            ? field.value.map((id) =>
                                getTags?.result.find((tag) => tag._id === id)
                              )
                            : []
                        }
                        onChange={(e, newValue) =>
                          handleFieldChange(
                            index,
                            "value",
                            newValue.map((tag) => tag._id)
                          )
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Box
                              component="span"
                              {...getTagProps({ index })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <Chip
                                key={option._id}
                                label={option.name}
                                {...getTagProps({ index })}
                                style={{
                                  backgroundColor: "#f1f2f3",
                                  color: "#000",
                                  width: "100px",
                                }}
                              />
                            </Box>
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select tags"
                            style={{
                              width: "180px",
                              height: "50px",
                            }}
                          />
                        )}
                        style={{
                          width: "180px",
                          height: "50px",
                        }}
                        // no clear icon
                        clearOnEscape
                        disableClearable
                      />
                    ) : field?.name === "leadStatus" &&
                      getStatus?.result?.leadsStatuses ? (
                      <Autocomplete
                        multiple
                        id="tags-filled"
                        options={getStatus?.result?.leadsStatuses || []}
                        getOptionLabel={(option) => option.name}
                        value={
                          Array.isArray(field.value)
                            ? field.value.map((id) =>
                                getStatus?.result?.leadsStatuses?.find(
                                  (tag) => tag._id === id
                                )
                              )
                            : []
                        }
                        onChange={(e, newValue) =>
                          handleFieldChange(
                            index,
                            "value",
                            newValue.map((tag) => tag?._id)
                          )
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Box
                              component="span"
                              {...getTagProps({ index })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <Chip
                                key={option?._id}
                                label={option?.name}
                                {...getTagProps({ index })}
                                style={{
                                  backgroundColor: "#f1f2f3",
                                  color: "#000",
                                  width: "100px",
                                }}
                              />
                            </Box>
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select tags"
                            style={{
                              width: "180px",
                              height: "50px",
                            }}
                          />
                        )}
                        style={{
                          width: "180px",
                          height: "50px",
                        }}
                        clearOnEscape
                        disableClearable
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id="inputZip"
                        value={field.value}
                        onChange={(e) =>
                          handleFieldChange(index, "value", e.target.value)
                        }
                        style={{
                          height: "55px",
                        }}
                      />
                    )}
                  </div>
                  <div className="row">
                    {index !== fields.length - 1 && (
                      <h4
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginBottom: "20px",
                          textTransform: "capitalize",
                        }}
                      >
                        {matchingValue === "any" ? "OR" : matchingValue}
                      </h4>
                    )}
                  </div>
                  {/* cross button */}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-dark waves-effect waves-light"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleAddField}
              >
                <FaPlus
                  style={{
                    marginRight: "5px",
                  }}
                />
                Add another field
              </button>
            </form>
          </div>
        </div>{" "}
      </Drawer>
      {/* <!-- Export contact start --> */}
      <Modal
        className={"modal fade" + (activeDropdownExport ? " show" : "")}
        open={activeDropdownExport}
        onClose={() => setActiveDropdownExport(false)}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exportContact"
        id="exportContact"
        aria-hidden="true"
        style={{ display: activeDropdownExport ? "block" : "none" }}
      >
        <div
          className="modal-dialog modal-dialog-scrollable modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exportContact">
                <FaDownload style={{ marginRight: "10px" }} />
                Export Contacts
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setActiveDropdownExport(false)}
              ></button>
            </div>

            <div className="modal-body">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitExport}
                enableReinitialize
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    <div className="number-conrct">
                      <div className="number-conrct-left">
                        <h4>Number of contacts</h4>
                        <h3>{getProfiles?.result?.allLeads?.length}</h3>
                      </div>
                      <div className="number-conrct-right">
                        <h4>File Format</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-check">
                              <Field
                                type="checkbox"
                                className="form-check-input"
                                name="fileFormat"
                                checked={values.fileFormat === "csv"}
                                onChange={() =>
                                  setFieldValue(
                                    "fileFormat",
                                    values.fileFormat === "csv" ? "" : "csv"
                                  )
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="fileFormat"
                              >
                                CSV
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check">
                              <Field
                                type="checkbox"
                                className="form-check-input"
                                name="fileFormat"
                                checked={values.fileFormat === "xlsx"}
                                onChange={() =>
                                  setFieldValue(
                                    "fileFormat",
                                    values.fileFormat === "xlsx" ? "" : "xlsx"
                                  )
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="fileFormat"
                              >
                                XLSX
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="export-email">
                      <div className="export-email-left">
                        <h4>Emails</h4>
                        <div className="export-email-direct">
                          <div className="export-email-direct-left">
                            <div className="form-check mb-2 form-check-primary">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="directEmails"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="directEmails"
                              >
                                Direct
                              </label>
                            </div>
                            <div className="form-check mb-2 form-check-primary">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="workEmails"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="workEmails"
                              >
                                Work
                              </label>
                            </div>
                          </div>
                          <div className="export-email-direct-right">
                            <button type="button" className="btn">
                              <i className="fa-solid fa-arrow-down-up-across-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="export-email-right">
                        <h4>Phones</h4>
                        <div className="export-email-direct">
                          <div className="export-email-direct-left">
                            <div className="form-check mb-2 form-check-primary">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="directPhones"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="directPhones"
                              >
                                Direct
                              </label>
                            </div>
                            <div className="form-check mb-2 form-check-primary">
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="workPhones"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="workPhones"
                              >
                                Work
                              </label>
                            </div>
                          </div>
                          <div className="export-email-direct-right">
                            <button type="button" className="btn">
                              <i className="fa-solid fa-arrow-down-up-across-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="includes-export">
                      <h4>Include in export</h4>
                      <div className="includes-export-main">
                        <div className="includes-export-left">
                          <div className="form-check mb-2 form-check-primary">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="includeResultsWithOutEmails"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="includeResultsWithOutEmails"
                            >
                              Contacts without any email
                            </label>
                          </div>
                        </div>
                        <div className="includes-export-right">
                          <div className="form-check mb-2 form-check-primary">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="includeResultsWithOutPhones"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="includeResultsWithOutPhones"
                            >
                              Unverified phones and emails
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="includes-export">
                      <h4>Fields template</h4>
                      <Field
                        as="select"
                        name="fieldsTemplate"
                        id="inputState"
                        className="form-select include-frm-exp"
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue("fieldsTemplate", value);
                          setFieldValue(
                            "customColumns",
                            value === "allFields" ? allFields : []
                          );
                        }}
                      >
                        <option value="customFields">Custom fields</option>
                        <option value="allFields">All fields</option>
                      </Field>
                      <div className="row pt-3">
                        <div className="col-md-4">
                          {allFields.slice(0, 6).map((field) => (
                            <div
                              className="form-check mb-2 form-check-success"
                              key={field}
                            >
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="customColumns"
                                value={
                                  field === "profileUrl" ? "imageUrl" : field
                                }
                                checked={
                                  values.customColumns.includes(
                                    field === "profileUrl" ? "imageUrl" : field
                                  ) || values.fieldsTemplate === "allFields"
                                }
                                disabled={values.fieldsTemplate === "allFields"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={field}
                              >
                                {field}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="col-md-4">
                          {allFields.slice(6, 12).map((field) => (
                            <div
                              className="form-check mb-2 form-check-success"
                              key={field}
                            >
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="customColumns"
                                value={field}
                                checked={
                                  values.customColumns.includes(field) ||
                                  values.fieldsTemplate === "allFields"
                                }
                                disabled={values.fieldsTemplate === "allFields"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={field}
                              >
                                {field}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="col-md-4">
                          {allFields.slice(12).map((field) => (
                            <div
                              className="form-check mb-2 form-check-success"
                              key={field}
                            >
                              <Field
                                className="form-check-input"
                                type="checkbox"
                                name="customColumns"
                                value={field}
                                checked={
                                  values.customColumns.includes(field) ||
                                  values.fieldsTemplate === "allFields"
                                }
                                disabled={values.fieldsTemplate === "allFields"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={field}
                              >
                                {field}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        Export
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => setActiveDropdownExport(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>{" "}
      <Dialog
        open={confirmOpenLeadNote}
        onClose={handleConfirmCloseLeadNote}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          // remove overlay background
          "& .css-1g7m0tk-MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
          zIndex: 9999,
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmCloseLeadNote} color="primary">
            Cancel
          </Button>
          <Button
            sx={{
              color: "#ff0000",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={handleUpdateProfile}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Popover
        id="simple-popover"
        open={openEditPopOver}
        anchorEl={anchorElId}
        onClose={() => {
          setOpenEditPopOver(false);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setAnchorElId(e.currentTarget);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  style={{
                    whiteSpace: "nowrap",
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  New Tag
                </h1>
                <hr />
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setOpenEditPopOver(false);
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Tage Name"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="color-option mb-3">
                    <h5
                      style={{
                        fontWeight: 600,
                        marginBottom: "10px",
                      }}
                    >
                      Set Color
                    </h5>
                    <div className="d-flex flex-wrap">
                      {colorPalette.map((color, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: "50%",
                            margin: 0.5,
                            cursor: "pointer",
                            border:
                              editColor === color
                                ? "2px solid #000"
                                : "2px solid transparent",
                          }}
                          onClick={(e) => {
                            setEditColor(color);
                          }}
                        />
                      ))}
                    </div>
                    {/* <div className="mt-2">
                              Selected Color: {selectedColor}
                            </div> */}
                  </div>

                  <div className="  d-md-flex justify-content-md-end">
                    <button
                      className="btn btn-secondary "
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        backgroundColor: "#000",
                        display: "flex",
                        alignItems: "center",
                        width: "100px",
                        whiteSpace: "nowrap",
                      }}
                      type="button"
                      onClick={handleCreateTags}
                    >
                      Create Tag
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Box>
      </Popover>
      <div
        className={"modal-backdrop fade" + (newView === true ? " show" : "")}
        style={{
          display: newView === true ? "block" : "none",
        }}
      ></div>
      <Popover
        id="simple-popover"
        open={openEditPopOverDrawer}
        anchorEl={popOverEl}
        onClose={() => {
          setOpenEditPopOverDrawer(false);
        }}
        anchorOrigin={{
          vertical: "right",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "right",
          horizontal: "left",
        }}
        sx={{
          zIndex: 10000000,
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setOpenEditPopOverDrawer(false);
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: 1,
              zIndex: 10000000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              style={{
                width: "350px",
              }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    style={{
                      whiteSpace: "nowrap",
                      width: "100%",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Edit Email
                  </h1>
                  <hr />
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setOpenEditPopOverDrawer(false);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    {inputField?.map((field, index) => (
                      <div
                        className="mb-2"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        key={index}
                      >
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Email"
                          value={field?.email}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                        />
                        <FaMinusCircle
                          style={{
                            color: "red",
                            height: "20px",
                            width: "20px",
                            fontSize: "20px",
                            cursor: "pointer",
                            marginLeft: "10px",
                          }}
                          onClick={() => handleRemoveField(index)}
                        />
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="d-md-flex justify-content-md-start">
                        <button
                          className="btn btn-secondary"
                          style={{
                            backgroundColor: "transparent",
                            color: "#000",
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ADADAD",
                          }}
                          type="button"
                          onClick={handleAddEmail}
                        >
                          + Add Email
                        </button>
                      </div>
                      <div className="d-md-flex justify-content-md-end">
                        <button
                          className="btn btn-secondary"
                          style={{
                            backgroundColor: "#000",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            width: "80px",
                          }}
                          type="button"
                          onClick={handleUpdateProfile}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Box>
        </ClickAwayListener>
      </Popover>
      <Dialog
        open={openTemplate}
        onClose={handleCloseTemplate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          zIndex: 10000000,
        }}
      >
        <div
          className="modal-content"
          style={{
            width: "600px",
            padding: "20px",
            margin: "0",
            borderRadius: "0",
            overflowX: "hidden",
          }}
        >
          <div className="modal-header mb-3">
            <h4 className="modal-title" id="myLargeModalLabel">
              {editTemplateName}
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseTemplate}
            ></button>
          </div>
          <div className="">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="">
                    <form>
                      <div className="mb-3">
                        <Box>
                          <TextField
                            label="Email"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {fieldValuePairs?.map(
                                    (fieldValuePairs, index) => (
                                      <Chip
                                        key={index}
                                        label={fieldValuePairs.email.email}
                                        onDelete={() => handleDelete(index)}
                                        style={{ margin: "4px" }}
                                      />
                                    )
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "1px solid #ced4da",
                                },
                              },
                              // on Focus style
                              "& .MuiOutlinedInput-root.Mui-focused": {
                                "& fieldset": {
                                  borderColor: "1px solid #ced4da",
                                },
                              },
                            }}
                          />
                        </Box>
                      </div>

                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Subject"
                          value={editTemplateSubject}
                          onChange={(e) =>
                            setEditTemplateSubject(e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-3 card border-0">
                        <div className="mb-4">
                          <div
                            className="mb-2"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "40px",
                            }}
                          >
                            <MyEditorDashboard
                              value={editorValue}
                              setValue={setEditorValue}
                              disable={true}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-end mt-5">
                          <button
                            className="btn btn-primary waves-effect waves-light"
                            onClick={(e) => handleSubmitEmail(e)}
                          >
                            {" "}
                            <span>Send</span>{" "}
                            <i className="mdi mdi-send ms-2"></i>{" "}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* <!-- end card--> */}

                  {/* <!-- end inbox-rightbar--> */}

                  <div className="clearfix"></div>
                </div>
              </div>
              {/* <!-- end Col --> */}
            </div>
          </div>
        </div>
        {/* <!-- /.modal-content --> */}
      </Dialog>
      {/* Import Dialog with upload CSV file and download button with beside upload and below Import button*/}
      <Dialog
        open={openImportDrawer}
        onClose={() => setOpenImportDrawer(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          zIndex: 10000000,
        }}
      >
        <div
          style={{
            padding: "20px",
            margin: "0",
            borderRadius: "0",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="modal-header mb-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h4 className="modal-title" id="myLargeModalLabel">
                Import Contacts
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setOpenImportDrawer(false)}
              ></button>
            </div>

            <DialogContent>
              <form>
                <div
                  className="mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    padding: "0px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <label
                          htmlFor="file"
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "GrayText",
                          }}
                        >
                          import file CSV/ EXCEL
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Email"
                          onChange={handleImportChange}
                        />
                        {!importValue && uploadImportFileError && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              color: "red",
                              marginTop: "5px",
                            }}
                          >
                            Please select a file
                          </div>
                        )}
                      </div>

                      {/* <div
                        style={{
                          width: "100px",
                          whiteSpace: "nowrap",
                          marginTop: "30px",
                          backgroundColor: "#323A46",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#323A46",
                            color: "#fff",
                          },
                        }}
                      ></div> */}
                      <button
                        className="btn "
                        onClick={(e) => {
                          e.preventDefault();
                          setDownloadingTemplate(true);

                          // Data structure
                          const headers = [
                            "name",
                            "email",
                            "phone",
                            "company",
                            "position",
                            "address",
                            "city",
                            "state",
                            "zip",
                            "country",
                            "tag",
                            "leadStatus",
                            "skills",
                            "current Position",
                            "Past Position",
                            "Education",
                            "Experience",
                          ];

                          const data = [headers];

                          // CSV Download
                          // const csvContent = data
                          //   .map((row) => row.join(","))
                          //   .join("\n");
                          // const csvBlob = new Blob([csvContent], {
                          //   type: "text/csv",
                          // });
                          // const csvUrl = window.URL.createObjectURL(csvBlob);
                          // const csvLink = document.createElement("a");
                          // csvLink.href = csvUrl;
                          // csvLink.download = "template.csv";
                          // document.body.appendChild(csvLink);
                          // csvLink.click();
                          // document.body.removeChild(csvLink);
                          // window.URL.revokeObjectURL(csvUrl);

                          // Excel Download
                          const worksheet = XLSX.utils.aoa_to_sheet(data);
                          const workbook = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(
                            workbook,
                            worksheet,
                            "Sheet1"
                          );

                          // Write workbook as an array buffer
                          const excelBuffer = XLSX.write(workbook, {
                            bookType: "xlsx",
                            type: "array",
                          });

                          // Create Blob from array buffer
                          const excelBlob = new Blob([excelBuffer], {
                            type: "application/octet-stream",
                          });
                          const excelUrl =
                            window.URL.createObjectURL(excelBlob);
                          const excelLink = document.createElement("a");
                          excelLink.href = excelUrl;
                          excelLink.download = "template.xlsx";
                          document.body.appendChild(excelLink);
                          excelLink.click();
                          document.body.removeChild(excelLink);
                          window.URL.revokeObjectURL(excelUrl);

                          setDownloadingTemplate(false);
                        }}
                        style={{
                          whiteSpace: "nowrap",
                          marginTop: "30px",
                          backgroundColor: "#323A46",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#323A46",
                            color: "#fff",
                          },
                        }}
                        disabled={downloadingTemplate}
                      >
                        {" "}
                        <span>
                          {downloadingTemplate
                            ? "Downloading"
                            : "Download Template"}
                        </span>{" "}
                        <i className="mdi mdi-send ms-2"></i>{" "}
                      </button>
                    </div>
                    {/* {
                          importValue.name.split(".").pop() === "csv" && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "20px",
                                color: "green"
                              }}
                            >
                              file is csv, you can import now
                            </div>
                          )
                        } */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "20px",
                        width: "60%",
                      }}
                    >
                      <input
                        type="email"
                        className={`form-control ${
                          !importEmail && uploadImportFileError
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Email"
                        value={importEmail}
                        onChange={(e) => setImportEmail(e.target.value)}
                        required
                      />
                      {!importEmail && uploadImportFileError && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            color: "red",
                          }}
                        >
                          Please enter email
                        </div>
                      )}
                    </div>
                    <div className="text-start mt-3">
                      <button
                        className="btn px-5"
                        style={{
                          backgroundColor: "#323A46",
                          color: "#fff",

                          "&:hover": {
                            backgroundColor: "#323A46",
                            color: "#fff",
                          },
                        }}
                        onClick={handleImportSubmit}
                        disabled={importsLoading}
                      >
                        {importsLoading ? (
                          <>
                            {" "}
                            <span>Importing</span>{" "}
                            <i className="fas fa-spinner fa-spin"></i>
                          </>
                        ) : isImportsComplete ? (
                          <>
                            <span>Imported</span>{" "}
                            <i className="mdi mdi-check ms-2"></i>
                          </>
                        ) : (
                          <>
                            <span>Import</span>{" "}
                            <i className="mdi mdi-send ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </DialogContent>
          </div>
        </div>
      </Dialog>
      {/* Delete Import Lead Dialog */}
      <Dialog
        open={openImportDeleted}
        onClose={() => setOpenImportDeleted(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          zIndex: 10000000,
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all of your Imported Leads?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImportDeleted(false)} color="primary">
            Cancel
          </Button>
          <Button
            sx={{
              color: "#ff000D",
              fontSize: "14px",
              fontWeight: 500,
            }}
            onClick={handleDeleteImportLead}
            color="primary"
            autoFocus
            disabled={deleteImportLoading}
          >
            {deleteImportLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default DataManager;
