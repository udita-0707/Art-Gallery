import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, ArrowLeft } from 'lucide-react';

const AdminArtworkForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Placeholder for Supabase integration
    setTimeout(() => {
      toast({
        title: "Supabase Required",
        description: "Connect Supabase to save artworks to the database",
        variant: "destructive"
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/artworks')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Artworks
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Artwork</h1>
          <p className="text-muted-foreground">
            Upload and catalog a new artwork
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Artwork Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Button type="button" variant="outline">
                    Upload Image
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Drag and drop or click to select
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Artwork title" required />
              </div>
              
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select artist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
                    <SelectItem value="marcus-wright">Marcus Wright</SelectItem>
                    <SelectItem value="elena-rodriguez">Elena Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2024" />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Artwork Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input id="medium" placeholder="Oil on canvas" />
              </div>
              
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" placeholder="24 x 36 inches" />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="sculpture">Sculpture</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="digital">Digital Art</SelectItem>
                    <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    <SelectItem value="drawing">Drawing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the artwork..." 
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/artworks')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Artwork'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminArtworkForm;