import { Container, FocusModal, Heading, Input, ProgressTabs, Table, Textarea, toast } from "@medusajs/ui";
import { useUpdateBlog } from "../routes/api/blogs";
import { useState, useEffect } from "react";
import { ArrowLongUp } from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import { GetBlogById } from "../routes/api/blogs";

type ImageKey = 'thumbnail_image1' | 'thumbnail_image2' | 'thumbnail_image3';


const UpdateBlog = ({ id, onClose, refetch }: { id: string, onClose: () => void, refetch: () => void }) => {
    const initialFormState = {
        author: "",
        tags: [],
        url_slug: "",
        title: "",
        subtitle: "",
        description: { content: "" },
        draft: "false",
        files: [],
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        published_date: null,
        updated_date: null,
        social_media_meta: {},
        canonical_url: "",
        alt_tags: {},
        internal_links: {},
        external_links: {},
    };

    const [formData, setFormData] = useState<{
        author: string;
        tags: string[];
        url_slug: string;
        title: string;
        subtitle: string;
        description: { content: string };
        draft: string;
        files: File[];
        seo_title: string;
        seo_keywords: string;
        seo_description: string;
        published_date: string | null;
        updated_date: string | null;
        social_media_meta: Record<string, any>;
        canonical_url: string;
        alt_tags: Record<string, any>;
        internal_links: Record<string, any>;
        external_links: Record<string, any>;
    }>(initialFormState);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modifiedFields, setModifiedFields] = useState<{ [key: string]: boolean }>({});
    const [removedImages, setRemovedImages] = useState<ImageKey[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [existingImages, setExistingImages] = useState<{ [key: string]: string }>({
        thumbnail_image1: "",
        thumbnail_image2: "",
        thumbnail_image3: "",
    });
    const [newImages, setNewImages] = useState<File[]>([]);


    const updateBlogMutation = useUpdateBlog();
    const getBlogByIdMutation = GetBlogById();

    const fetchBlogData = async () => {
        if (!id) return;

        setIsFetching(true);
        try {
            const blogData = await getBlogByIdMutation.mutateAsync(id);

            const parsedTags: string[] = Array.isArray(blogData.blog.tags)
            ? blogData.blog.tags.map((tag: string) => tag.replace(/[\[\]"]+/g, "").trim()).filter(Boolean)
            : blogData.blog.tags
                .replace(/[\[\]"]+/g, "")
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean);

            let parsedDescription = { content: "" };
            if (typeof blogData.blog.description === "string") {
                try {
                    parsedDescription = JSON.parse(blogData.blog.description);
                } catch (error) {
                    console.error("Error parsing description:", error);
                    parsedDescription = { content: blogData.blog.description || "" };
                }
            } else if (blogData.blog.description && typeof blogData.blog.description === "object") {
                parsedDescription = blogData.blog.description;
            }

            setExistingImages({
                thumbnail_image1: blogData.blog.thumbnail_image1 || "",
                thumbnail_image2: blogData.blog.thumbnail_image2 || "",
                thumbnail_image3: blogData.blog.thumbnail_image3 || ""
            });

            setFormData({
                ...blogData.blog,
                tags: parsedTags,
                description: parsedDescription,
                files: [],
                published_date: blogData.blog.published_date || null,
                updated_date: blogData.blog.updated_date || null,

            });
        } catch (error: any) {
            const errorMsg = error.message || "Failed to fetch blog data";
            toast.error(errorMsg);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (isModalOpen && id) {
            fetchBlogData();
        }
    }, [isModalOpen]);

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();

            // Avoid duplicate tags
            if (!formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                }));
            }

            setTagInput(""); // Clear input after adding
        }
    };


    const removeTag = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => {
            if (name === "description") {
                return { ...prevFormData, description: { content: value } };
            }
            else if (name === "published_date" || name === "updated_date") {
                if (value.trim() !== "") {
                    try {
                        return { ...prevFormData, [name]: new Date(value).toISOString() };
                    } catch (error) {
                        return { ...prevFormData, [name]: null };
                    }
                } else {
                    return { ...prevFormData, [name]: undefined };
                }
            }
            else {
                return { ...prevFormData, [name]: value };
            }
        });
    };


    const removeExistingImage = (imageKey: ImageKey) => {
        if (existingImages[imageKey]) {
            setRemovedImages((prev) => [...prev, imageKey]);

            // Clear the existing image slot
            setExistingImages((prevImages) => ({
                ...prevImages,
                [imageKey]: ""
            }));
        }
    };



    const removeNewFile = (indexToRemove: number) => {
        setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewImages((prev) => {
                const uniqueFiles = Array.from(files).filter(
                    (file) => !prev.some((existing) => existing.name === file.name)
                );
                return [...prev, ...uniqueFiles];
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();

        const cleanTags = (tags: string[]) => {
            return tags
                .map((tag) => tag.replace(/[\[\]"]+/g, "").trim()) // Remove extra brackets and quotes
                .filter(Boolean) // Remove empty tags
                .join(","); // Join as comma-separated
        };
    

        // Append non-file fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "files") return;
            if (key === "tags") {
                formDataToSend.append("tags", cleanTags(value as string[]));
                return;
            }
            if (key === "description" && JSON.stringify(value) === JSON.stringify(initialFormState.description)) {
                return;
            }
            if (typeof value === "object" && value !== null) {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        if (removedImages.length > 0) {
            formDataToSend.append("removed_images", JSON.stringify(removedImages));
        }


        const imageKeys: ImageKey[] = ['thumbnail_image1', 'thumbnail_image2', 'thumbnail_image3'];
        const availableSlots = imageKeys.filter((slot) => !existingImages[slot]);

        newImages.forEach((file, index) => {
            if (index < availableSlots.length) {
                formDataToSend.append(availableSlots[index], file);
            }
        });

        try {
            await updateBlogMutation.mutateAsync({ id, formData: formDataToSend });
            toast.success("Blog updated successfully!");
            setIsModalOpen(false);
            refetch();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update blog");
        } finally {
            setIsLoading(false);
        }
    };




    const removeFile = (index: number) => {
        setFormData(prevData => ({
            ...prevData,
            files: prevData.files.filter((_, i) => i !== index)
        }));
    };



    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    const getTagsString = () => formData.tags.join(", ");

    return (
        <div className="flex justify-between">
            <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <FocusModal.Trigger asChild>
                    <Button variant="secondary" className="w-30 h-7" onClick={() => setIsModalOpen(true)}>
                        <ArrowLongUp />Update
                    </Button>
                </FocusModal.Trigger>
                <FocusModal.Content>
                    <FocusModal.Header>
                        <FocusModal.Title>Update Blog</FocusModal.Title>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || isFetching}
                            className="relative flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </FocusModal.Header>
                    <FocusModal.Body>
                        {isFetching ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="ml-2">Loading blog data...</span>
                            </div>
                        ) : (
                            <ProgressTabs defaultValue="general" onValueChange={handleTabChange} value={activeTab}>
                                <ProgressTabs.List>
                                    <ProgressTabs.Trigger value="general">General</ProgressTabs.Trigger>
                                    <ProgressTabs.Trigger value="Images_Upload">Images</ProgressTabs.Trigger>
                                    <ProgressTabs.Trigger value="Seo_others">SEO & Others</ProgressTabs.Trigger>
                                </ProgressTabs.List>

                                <ProgressTabs.Content value="general">
                                    <div className="w-full flex flex-row items-center gap-6 justify-between px-14 py-16 space-y-4 max-w-8xl">
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-xl font-medium">Author</label>
                                            <Input
                                                type="text"
                                                name="author"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="Author Name"
                                                value={formData.author}
                                            />

                                            <label className="block text-xl font-medium mb-2">Tags</label>

                                            <div className="flex flex-wrap gap-2 w-[40vw] min-h-[5vh] p-2 border border-gray-300 rounded-lg">
                                                {formData.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}

                                                <input
                                                    type="text"
                                                    name="tagInput"
                                                    className="flex-1 outline-none bg-transparent"
                                                    placeholder="Add tags and press Enter"
                                                    value={tagInput}
                                                    onChange={handleTagInput}
                                                    onKeyDown={addTag}
                                                />
                                            </div>



                                            <label className="block text-xl font-medium">Title</label>
                                            <Input
                                                type="text"
                                                name="title"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="Blog Title"
                                                value={formData.title}
                                            />

                                            <label className="block text-xl font-medium">Subtitle</label>
                                            <Input
                                                type="text"
                                                name="subtitle"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="Subtitle"
                                                value={formData.subtitle}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-xl font-medium">URL Slug</label>
                                            <Input
                                                type="text"
                                                name="url_slug"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="URL Slug"
                                                value={formData.url_slug}
                                            />

                                            <label className="block text-xl font-medium">Description</label>
                                            <Textarea
                                                name="description"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="Blog description..."
                                                value={formData.description?.content || ""}
                                            />
                                        </div>
                                    </div>
                                </ProgressTabs.Content>

                                <ProgressTabs.Content value="Images_Upload">
                                    <div className="flex flex-col gap-6 py-12 px-12 m-w-8xl">
                                        <label className="text-xl font-medium">Thumbnail Images</label>
                                        <Input
                                            type="file"
                                            className="w-[60vw] h-[6vh]"
                                            multiple
                                            onChange={(e) => handleFileUpload(e)}
                                        />
                                        {(existingImages.thumbnail_image1 || existingImages.thumbnail_image2 || existingImages.thumbnail_image3) && (
                                            <div className="mt-6">
                                                <p className="font-medium mb-3">Current Images:</p>
                                                <div className="flex gap-4 flex-wrap">
                                                    {/* Display Existing Images */}
                                                    {existingImages.thumbnail_image1 && (
                                                        <div className="relative">
                                                            <img
                                                                src={existingImages.thumbnail_image1}
                                                                alt="Thumbnail 1"
                                                                className="h-24 w-auto object-cover rounded-md border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage('thumbnail_image1')}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                                                aria-label="Remove existing image"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    )}
                                                    {existingImages.thumbnail_image2 && (
                                                        <div className="relative">
                                                            <img
                                                                src={existingImages.thumbnail_image2}
                                                                alt="Thumbnail 2"
                                                                className="h-24 w-auto object-cover rounded-md border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage('thumbnail_image2')}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                                                aria-label="Remove existing image"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    )}
                                                    {existingImages.thumbnail_image3 && (
                                                        <div className="relative">
                                                            <img
                                                                src={existingImages.thumbnail_image3}
                                                                alt="Thumbnail 3"
                                                                className="h-24 w-auto object-cover rounded-md border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage('thumbnail_image3')}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                                                aria-label="Remove existing image"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Display New Images */}
                                                    {newImages.map((file, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`Thumbnail ${index + 4}`}
                                                                className="h-24 w-auto object-cover rounded-md border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewFile(index)}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                                                aria-label="Remove new image"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        )}
                                        {/* Display current files */}
                                        {formData.files.length > 0 && (
                                            <div className="mt-4">
                                                <p className="font-medium">Selected Files ({formData.files.length}):</p>
                                                <ul className="space-y-2 mt-2">
                                                    {formData.files.map((file, index) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <span>{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                                aria-label="Remove file"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                </svg>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </ProgressTabs.Content>

                                <ProgressTabs.Content value="Seo_others">
                                    <div className="w-full flex flex-row items-center gap-6 justify-between px-14 py-16 space-y-4 max-w-8xl">
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-xl font-medium">SEO Title</label>
                                            <Input
                                                type="text"
                                                name="seo_title"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="SEO Title"
                                                value={formData.seo_title}
                                            />

                                            <label className="block text-xl font-medium">SEO Keywords</label>
                                            <Input
                                                type="text"
                                                name="seo_keywords"
                                                onChange={handleChange}
                                                placeholder="SEO Keywords"
                                                value={formData.seo_keywords}
                                            />

                                            <label className="block text-xl font-medium">SEO Description</label>
                                            <Textarea
                                                name="seo_description"
                                                onChange={handleChange}
                                                placeholder="SEO Description"
                                                value={formData.seo_description}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="block text-xl font-medium">Canonical URL</label>
                                            <Input
                                                type="text"
                                                name="canonical_url"
                                                className="w-[40vw] h-[5vh]"
                                                onChange={handleChange}
                                                placeholder="Canonical URL"
                                                value={formData.canonical_url}
                                            />

                                            <label className="block text-xl font-medium">Published Date</label>
                                            <Input
                                                type="date"
                                                name="published_date"
                                                onChange={handleChange}
                                                value={formData.published_date ? new Date(formData.published_date).toISOString().split('T')[0] : ""}
                                            />

                                            <label className="block text-xl font-medium">Update Date</label>
                                            <Input
                                                type="date"
                                                name="updated_date"
                                                onChange={handleChange}
                                                value={formData.updated_date ? new Date(formData.updated_date).toISOString().split('T')[0] : ""}
                                            />
                                        </div>
                                    </div>
                                </ProgressTabs.Content>
                            </ProgressTabs>
                        )}
                    </FocusModal.Body>
                </FocusModal.Content>
            </FocusModal>
        </div>
    );
};

export default UpdateBlog;