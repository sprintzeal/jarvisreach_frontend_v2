import React, { useEffect, useState } from "react";
import List from "../../../components/blog__help/List";
import {
  useDeleteHelpMutation,
  useGetCreateCategoryQuery,
  useGetHelpQuery,
  useUpdateHelpMutation,
} from "../../../slices/adminSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const HelpList = () => {
  // const [categoryData,setCategoryData]=useState()
  const [deleteHelpId, setDeleteHelpId] = useState(null);
  const [openDeleteHelp, setOpenDeleteHelp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data, isLoading, isSuccess } = useGetCreateCategoryQuery({
    page: 1,
    limit: 5,
    // search:"New"
    pagination: false,
  });
  // if (isSuccess) {
  //   console.log("Data :", data);
  // }
  const [deleteHelp, { isLoading: deleteHelpLoading }] =
    useDeleteHelpMutation();
  const [updateHelp, { isLoading: updateHelpLoading }] =
    useUpdateHelpMutation();
  const {
    data: getHelpSupport,
    isLoading: getHelpSupportLoading,
    isSuccess: getHelpSupportSuccess,
  } = useGetHelpQuery({
    page: page,
    limit: limit,
  });

  const handleDeleteHelp = async () => {
    await deleteHelp({
      ids: [deleteHelpId],
    })
      .unwrap()
      .then((res) => {
        toast.success("Help Deleted Successfully");
        setOpenDeleteHelp(false);
        setDeleteHelpId(null);
      })
      .catch((err) => {
        toast.success(err.data.message);
      });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allCheck = getHelpSupport?.result.map((question) => question._id);
      setSelectedRows(allCheck);
    } else {
      setSelectedRows([]);
    }
  };

  // Handle row checkbox change
  const handleRowSelect = (id) => {
    // console.log(id);
    setSelectedRows((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        // Remove ID from selected rows
        return prev.filter((item) => item !== id);
      } else {
        // Add ID to selected rows
        return [...prev, id];
      }
    });
    // console.log("showDeleteButton :", showDeleteButton);
  };
  // Handle delete action for selected rows
  const handleDeleteSelected = async () => {
    if (selectedRows.length > 0) {
      try {
        // Perform delete operation
        await deleteHelp({ ids: selectedRows });
        // Clear selected rows and hide delete button
        setSelectedRows([]);
        setShowDeleteButton(false);
        setOpenDeleteModal(false);
        toast.success("Items successfully deleted.");
      } catch (error) {
        toast.error("Failed to delete items.");
      }
    }
  };
  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      question: Yup.string()
        .min(3, "Question must be at least 3 characters")
        .required("Question is required"),
      answer: Yup.string().min(3, "Answer must be at least 3 characters"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      // remove <p><br></p> from the answer

      if (
        values.question === "" ||
        values.answer.replace(/<p><br><\/p>/g, "") === ""
      ) {
        toast.error(
          `Please fill all the fields: ${
            values.question === "" ? "Question" : "Answer"
          }`
        );
        return;
      }
      try {
        if (isEditing) {
          await updateHelp({
            id: editCategory._id,
            updatedHelp: values,
          });
          setEditDialog(false);
          toast.success("Edit Category Successfully");
        } else {
          await updateHelp({ body: values }).unwrap();
          setActiveDialog(false);
          toast.success("Package created successfully");
        }
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Error creating package");
      }
    },
  });

  const handleEditClick = (category) => {
    setEditCategory(category);
    setEditDialog(true);
    setIsEditing(true);
    // console.log("Category :", category);
  };

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getHelpSupport?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(getHelpSupport?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getHelpSupport?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getHelpSupport?.limit)
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

  useEffect(() => {
    if (editCategory) {
      formik.setValues({
        question: editCategory.question,
        answer: editCategory.answer,
        status: editCategory.status,
      });
    }
  }, [editCategory]);
  useEffect(() => {
    setShowDeleteButton(selectedRows.length > 0);
  }, [selectedRows]);

  return (
    <div>
      <List
        name="Help"
        title="Help Title"
        list="Help List"
        categoryData={data}
        isGetCategory={isSuccess}
        getHelpSupportSuccess={getHelpSupportSuccess}
        getHelpSupportLoading={getHelpSupportLoading}
        getHelpSupport={getHelpSupport}
        setDeleteHelpId={setDeleteHelpId}
        setOpenDeleteHelp={setOpenDeleteHelp}
        openDeleteHelp={openDeleteHelp}
        handleDeleteHelp={handleDeleteHelp}
        handleRowSelect={handleRowSelect}
        selectedRows={selectedRows}
        showDeleteButton={showDeleteButton}
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        handleDeleteSelected={handleDeleteSelected}
        handleSelectAll={handleSelectAll}
        handleEditClick={handleEditClick}
        setEditDialog={setEditDialog}
        editDialog={editDialog}
        formik={formik}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        handlePageClick={handlePageClick}
        totalPages={totalPages}
        getVisiblePages={getVisiblePages}
        handleNextClick={handleNextClick}
        handlePrevClick={handlePrevClick}
        handleItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={itemsPerPageOptions}
        updateHelpLoading={updateHelpLoading}
        deleteHelpLoading={deleteHelpLoading}
      />
    </div>
  );
};

export default HelpList;
