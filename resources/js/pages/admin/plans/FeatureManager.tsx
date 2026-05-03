import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

export default function FeatureManager() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'boolean',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/features', {
            onSuccess: () => reset(),
        });
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-blue-600" />
                    Add New Feature
                </CardTitle>
                <CardDescription>Create a new feature to assign to your plans.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Feature Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Priority Support"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Feature Type</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                                <SelectItem value="limit">Limited (Quantity)</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe what this feature provides..."
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <Button type="submit" disabled={processing} className="w-full gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Feature
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
