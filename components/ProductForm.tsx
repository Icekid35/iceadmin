"use client";

import { useState } from "react";
import { z } from "zod";
import { Category, Image, Product, Size } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "./modals/alertModal";
import ImageUpload from "./ui/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";

interface ProductFormProps {
  categories: Category[];
  initialData:
  | (Product & {
    images: Image[];
  })
  | null;
}
const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(10),
  images: z.object({ url: z.string() }).array().min(1),
  categoryId: z.string().min(1),
  sizes: z.string().array(),
  description:z.string().min(5),
  colors: z.string().array().optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});
type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({
  initialData,
  categories = [],
}: ProductFormProps) => {
  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Create a new product";
  const action = initialData ? "Save changes" : "Create";
  const toastMessage = initialData ? "Changes saved" : "Product Created";

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      price: 0,
      images: [],
      categoryId: "",
      description:"",
      sizes: [],
      colors: [],
      discount: 0,
      isFeatured: false,
      isArchived: false,
    },
  });

  const user = useUser();
  // user = user?.id ? user : { id: "user_2qD6Z3k9fUqNxTznfcJFj0TTK7a" };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params?.storeId}/products/${params?.productId}`,
          { ...data, userId: user?.id }
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, {
          ...data,
          userId: user?.id,
        });
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error)
      alert(error)
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted!");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isOpen={isOpen}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={() => setIsOpen(true)}
            size="sm"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value?.map((image) => image.url)}
                    disabled={isLoading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((item) => item.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="10.2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter sizes separated by commas"
                      onChange={(e) =>
                        field.onChange(e.target.value.split(",").map((size) => size.trim()))
                      }
                      value={field.value?.join(", ") || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter colors separated by commas"
                      onChange={(e) =>
                        field.onChange(e.target.value.split(",").map((color) => color.trim()))
                      }
                      value={field.value?.join(", ") || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      // type="number"
                      disabled={isLoading}
                      placeholder="Optional discount 1-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea
          disabled={isLoading}
          placeholder="Enter a detailed description"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start flex-row space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Featured products appear in the homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-start flex-row space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will never appear in the homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
