import React, { useEffect, useState } from "react";
import Category from "../../../components/Category";
import {
  useCreateBlogMutation,
  useCreateCategoryMutation,
  useDeleteBlogMutation,
  useGetBlogQuery,
  useUpdateBlogMutation,
  useUpdateCategoryMutation,
} from "../../../slices/adminSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const BlogCategory = ({ collapsed }) => {
  const [activeDialog, setActiveDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeletePlan, setOpenDeletePlan] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected row IDs
  const [showDeleteButton, setShowDeleteButton] = useState(false); // Show delete button
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const {
    data: getBlog,
    isLoading: blogLoading,
    isError: blogError,
    isSuccess: blogSuccess,
  } = useGetBlogQuery({ page: page, limit: limit });

  const itemsPerPageOptions = [5, 10, 20, 50];
  const totalItems = getBlog?.totalItems || 0;
  const [currentPage, setCurrentPage] = useState(getBlog?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(
    itemsPerPageOptions[
      itemsPerPageOptions.indexOf(getBlog?.limit) !== -1
        ? itemsPerPageOptions.indexOf(getBlog?.limit)
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

  useEffect(() => {
    if (editCategory) {
      formik.setValues({
        categoryName: editCategory.categoryName,
        status: editCategory.status,
      });
    }
  }, [editCategory]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
    setPage(1);
    setLimit(Number(event.target.value));
  };
  const handleEditClick = (category) => {
    setEditCategory(category);
    setIsEditing(true);
    setEditDialog(true);
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
  const [updateCategory] = useUpdateBlogMutation();
  const [createCategory, { isLoading, isSuccess, isError }] =
    useCreateBlogMutation();
  const formik = useFormik({
    initialValues: {
      categoryName: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required")
        .test(
          "checkCategoryName",
          "Category name already exists",
          async (value) => {
            const isDuplicate = getBlog?.result.some(
              (category) =>
                category.categoryName.toLowerCase() === value.toLowerCase()
            );
            return !isDuplicate;
          }
        ),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditing) {
          await updateCategory({
            id: editCategory._id,
            body: {
              categoryName: values.categoryName,
              status: values.status,
            },
          }).unwrap();
          setEditDialog(false);
          toast.success("Edit Category Successfully");
        } else {
          await createCategory({
            body: {
              categoryName: values.categoryName,
              status: values.status,
            },
          }).unwrap();
          setActiveDialog(false);
          toast.success("Blog created successfully");
        }

        resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Error creating package");
      }
    },
  });

  const [deleteCategory, { isLoading: deletePlanLoading }] =
    useDeleteBlogMutation();

  const handleDeleteCategory = async () => {
    await deleteCategory({
      ids: [deletePlanId],
    })
      .unwrap()
      .then((res) => {
        toast.success("Category deleted successfully.");
        setOpenDeletePlan(false);
        setDeletePlanId(null);
      })
      .catch((error) => {
        toast.error(error.data.message);
      });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all rows
      const allIds = getBlog?.result.map((category) => category._id);
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

  const handleDeleteSelected = async () => {
    if (selectedRows.length > 0) {
      try {
        // Perform delete operation
        await deleteCategory({ ids: selectedRows });
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

  useEffect(() => {
    setShowDeleteButton(selectedRows.length > 0);
  }, [selectedRows]);

  return (
    <div>
      <Category
        name="Blog"
        title="Category"
        list="Blog Category"
        data={getBlog}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        loading={blogLoading}
        error={blogError}
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
        formik={formik}
        handleRowSelect={handleRowSelect}
        handleSelectAll={handleSelectAll}
        selectedRows={selectedRows}
        showDeleteButton={showDeleteButton}
        handleDeleteSelected={handleDeleteSelected}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        handleDeleteCategory={handleDeleteCategory}
        openDeletePlan={openDeletePlan}
        setOpenDeletePlan={setOpenDeletePlan}
        setDeletePlanId={setDeletePlanId}
        deletePlanLoading={deletePlanLoading}
        activeDialog={activeDialog}
        setActiveDialog={setActiveDialog}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isSuccess={blogSuccess}
        handleEditClick={handleEditClick}
        collapsed={collapsed}
      />
    </div>
  );
};

export default BlogCategory;
