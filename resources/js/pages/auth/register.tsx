import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { City, Country, State } from 'country-state-city';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    celular: string;
    pais: string;
    departamento: string;
    ciudad: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        celular: '',
        pais: '',
        departamento: '',
        ciudad: '',
        password: '',
        password_confirmation: '',
    });

    const [countries, setCountries] = useState(Country.getAllCountries());
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    useEffect(() => {
        if (data.pais) {
            const selectedCountry = countries.find((c) => c.isoCode === data.pais);
            const countryStates = State.getStatesOfCountry(data.pais);
            setStates(countryStates);
            setData('departamento', '');
            setData('ciudad', '');
            setCities([]);
        }
    }, [data.pais]);

    useEffect(() => {
        if (data.pais && data.departamento) {
            const stateCities = City.getCitiesOfState(data.pais, data.departamento);
            setCities(stateCities);
            setData('ciudad', '');
        }
    }, [data.departamento]);

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="celular">Celular</Label>
                        <Input
                            id="celular"
                            type="text"
                            required
                            autoFocus
                            tabIndex={5}
                            autoComplete="celular"
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            disabled={processing}
                            placeholder="Ingresa tu numero celular"
                        />
                        <InputError message={errors.celular} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-3 grid-rows-1 items-center justify-center gap-2">
                        <div>
                            <Label htmlFor="pais">País</Label>
                            <select
                                id="pais"
                                value={data.pais}
                                onChange={(e) => setData('pais', e.target.value)}
                                disabled={processing}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.pais} className="mt-2" />
                        </div>

                        {/* Departamento */}
                        <div>
                            <Label htmlFor="departamento">Departamento</Label>
                            <select
                                id="departamento"
                                value={data.departamento}
                                onChange={(e) => setData('departamento', e.target.value)}
                                disabled={!states.length || processing}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Selecciona un departamento</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.departamento} className="mt-2" />
                        </div>

                        {/* Ciudad */}
                        <div>
                            <Label htmlFor="ciudad">Ciudad</Label>
                            <select
                                id="ciudad"
                                value={data.ciudad}
                                onChange={(e) => setData('ciudad', e.target.value)}
                                disabled={!cities.length || processing}
                                className="w-full rounded border p-2"
                            >
                                <option value="">Selecciona una ciudad</option>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.ciudad} className="mt-2" />
                        </div>
                    </div>
                    <Button type="submit" className="mt-2 w-full" tabIndex={9} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={10}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
