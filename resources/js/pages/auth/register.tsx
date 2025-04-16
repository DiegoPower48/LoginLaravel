import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { City, Country, State } from 'country-state-city';

import ReCAPTCHA from 'react-google-recaptcha';

type RegisterForm = {
    name: string;
    email: string;
    celular: string;
    pais: string;
    departamento: string;
    ciudad: string;
    password: string;
    password_confirmation: string;
    recaptcha: string;
};

type CountryType = {
    isoCode?: string;
    name: string;
};

export default function Register() {
    const [countries, setCountries] = useState(Country.getAllCountries());
    const [states, setStates] = useState<CountryType[]>([]);
    const [cities, setCities] = useState<Array<CountryType>>([]);

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        celular: '',
        pais: 'pais',
        departamento: '',
        ciudad: '',
        password: '',
        password_confirmation: '',
        recaptcha: '',
    });
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation', 'pais', 'departamento', 'ciudad', 'celular');
                recaptchaRef.current?.reset();
            },
        });
    };

    useEffect(() => {
        if (data.pais) {
            countries.find((c) => c.isoCode === data.pais);
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
        <AuthLayout title="Crea una cuenta" description="Ingresa tus datos por favor">
            <Head title="Register" />
            <form className="flex flex-col" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre:</Label>
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
                            placeholder="Ingresa tu nombre"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electronico:</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="Ingresa tu correo"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña:</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Escribe una contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar contraseña:</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirma tu contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="celular">Celular:</Label>
                        <Input
                            id="celular"
                            type="number"
                            required
                            className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            maxLength={12}
                            tabIndex={5}
                            autoComplete="celular"
                            value={data.celular}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,10}$/.test(value)) {
                                    setData('celular', value);
                                }
                            }}
                            disabled={processing}
                            placeholder="Ingresa tu numero celular"
                        />
                        <InputError message={errors.celular} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-3 grid-rows-1 items-center justify-center gap-2">
                        <div className="border-input-1 rounded-md border-2 p-2">
                            <Label htmlFor="pais">País:</Label>
                            <select
                                id="pais"
                                value={data.pais}
                                required
                                onChange={(e) => setData('pais', e.target.value)}
                                disabled={processing}
                                className="w-full rounded border p-2 text-xs"
                            >
                                <option className="bg-accent" value="">
                                    País
                                </option>
                                {countries.map((country) => (
                                    <option className="bg-accent text-sm" key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.pais} className="mt-2" />
                        </div>

                        <div className="border-input-1 rounded-md border-2 p-2">
                            <Label htmlFor="departamento">Departamento:</Label>
                            <select
                                id="departamento"
                                value={data.departamento}
                                required
                                onChange={(e) => setData('departamento', e.target.value)}
                                disabled={!states.length || processing}
                                className="w-full rounded border p-2 text-xs"
                            >
                                <option className="bg-accent" value="">
                                    Departamento
                                </option>
                                {states.map((state) => (
                                    <option className="bg-accent text-sm" key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>

                            <InputError message={errors.departamento} className="mt-2" />
                        </div>

                        <div className="border-input-1 rounded-md border-2 p-2">
                            <Label htmlFor="ciudad">Ciudad:</Label>
                            <select
                                id="ciudad"
                                value={data.ciudad}
                                required
                                onChange={(e) => setData('ciudad', e.target.value)}
                                disabled={!cities.length || processing}
                                className="w-full rounded border p-2 text-xs"
                            >
                                <option className="bg-accent" value="">
                                    Ciudad
                                </option>
                                {cities.map((city) => (
                                    <option className="bg-accent text-sm" key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.ciudad} className="mt-2" />
                        </div>
                    </div>
                    <ReCAPTCHA
                        required
                        ref={recaptchaRef}
                        sitekey="6LdljRkrAAAAAHqoT7g1toof9oX8v2Ms9Hm7Wl8i"
                        onChange={(token: string | null) => setData('recaptcha', token || '')}
                    />
                    <InputError message={errors.recaptcha_response} className="mt-2" />
                    <Button type="submit" className="mt-2 w-full" tabIndex={9} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Crear cuenta
                    </Button>

                    <div className="text-muted-foreground text-center text-sm">
                        Already have an account?
                        <TextLink href={route('login')} tabIndex={10}>
                            Log in
                        </TextLink>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
