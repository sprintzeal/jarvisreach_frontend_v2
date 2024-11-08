import React, { useEffect, useState } from "react";
import Category from "../../../components/Category";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCreateCategoryQuery,
  useUpdateCategoryMutation,
} from "../../../slices/adminSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const HelpCategory = ({ collapsed }) => {
  const [activeDialog, setActiveDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeletePlan, setOpenDeletePlan] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected row IDs
  const [showDeleteButton, setShowDeleteButton] = useState(false); // Show delete button
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeletingCategories, setIsDeletingCategories] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteHelpCategory }] =
    useDeleteCategoryMutation();
  const {
    data: getCategories,
    isLoading: createCategoryQueryLoading,
    isSuccess,
  } = useGetCreateCategoryQuery({
    page: page,
    limit: limit,
  });
  // console.log(isSuccess && "Data :", data)
  // useEffect(() => {
  //   if (isSuccess) {
  //     console.log("Data:", getCategories);
  //   }
  // }, [isSuccess, getCategories]);
  const formik = useFormik({
    initialValues: {
      categoryName: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required")
        .test("checkName", "Name already Exist", (value) => {
          const isDuplicate = getCategories?.result.some(
            (category) =>
              category.categoryName.toLowerCase() === value.toLowerCase()
          );
          return !isDuplicate;
        }),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditing) {
          await updateCategory({
            id: editCategory._id,
            updatedCategory: values,
          });
          setEditDialog(false);
          toast.success("Edit Category Successfully");
        } else {
          await createCategory({ body: values }).unwrap();
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

  useEffect(() => {
    if (editCategory) {
      formik.setValues({
        categoryName: editCategory.categoryName,
        status: editCategory.status,
      });
    }
  }, [editCategory]);

  const handleEditClick = (category) => {
    setEditCategory(category);
    setIsEditing(true);
    setEditDialog(true);
  };

  const handleDeleteCategory = async () => {
    await deleteCategory({
      ids: [deletePlanId],
    })
      .unwrap()
      .then((res) => {
        toast.success("Plan Successfully Deleted");
        setOpenDeletePlan(false);
        setDeletePlanId(null);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };

  // Handle select/deselect all checkbox change
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all rows
      const allIds = getCategories?.result.map((category) => category._id);
      setSelectedRows(allIds);
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }
  };

  // Handle row checkbox change
  const handleRowSelect = (id) => {
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
  };

  // Handle delete action for selected rows
  const handleDeleteSelected = async () => {
    if (selectedRows.length > 0) {
      try {
        // Perform delete operation
        setIsDeletingCategories(true);
        await deleteCategory({ ids: selectedRows });
        setIsDeletingCategories(false);
        // Clear selected rows and hide delete button
        setSelectedRows([]);
        setShowDeleteButton(false);
        setOpenDeleteModal(false);
        toast.success("Items successfully deleted.");
      } catch (error) {
        setIsDeletingCategories(false);
        toast.error("Failed to delete items.");
      }
    }
  };

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getCategories?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(getCategories?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getCategories?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getCategories?.limit)
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

  // Update delete button visibility based on selection
  useEffect(() => {
    setShowDeleteButton(selectedRows.length > 0);
  }, [selectedRows]);
  return (
    <div>
      <Category
        name="Help"
        title="Category"
        list="Help Category"
        formik={formik}
        activeDialog={activeDialog}
        setActiveDialog={setActiveDialog}
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        handleEditClick={handleEditClick}
        handleDeleteCategory={handleDeleteCategory}
        openDeletePlan={openDeletePlan}
        setOpenDeletePlan={setOpenDeletePlan}
        deletePlanId={deletePlanId}
        setDeletePlanId={setDeletePlanId}
        selectedRows={selectedRows}
        handleSelectAll={handleSelectAll}
        handleRowSelect={handleRowSelect}
        handleDeleteSelected={handleDeleteSelected}
        deleteHelpCategory={deleteHelpCategory}
        isDeletingCategories={isDeletingCategories}
        showDeleteButton={showDeleteButton}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        data={getCategories}
        isLoading={createCategoryQueryLoading}
        isSuccess={isSuccess}
        setEditCategory={setEditCategory}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        itemsPerPageOptions={itemsPerPageOptions}
        totalItems={totalItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalPages={totalPages}
        handlePageClick={handlePageClick}
        handleNextClick={handleNextClick}
        handlePrevClick={handlePrevClick}
        handleItemsPerPageChange={handleItemsPerPageChange}
        getVisiblePages={getVisiblePages}
        collapsed={collapsed}
      />
    </div>
  );
};

export default HelpCategory;
