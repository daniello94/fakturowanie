import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "./Home.css"

export default function Home() {
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [typePerson, setTypePerson] = useState('');
    const [numberId, setNumberId] = useState('');
    const [nameCompany, setNameCompany] = useState('');
    const [numberIdCompany, setNumberIdCompany] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [vat, setVat] = useState('');
    const [nameCourse, setNameCourse] = useState('');
    const [priceCourse, setPriceCourse] = useState('')
    const [sumPriceCourse, setSumPraiseCourse] = useState('')

    function valuePriceCourse() {
        if (nameCourse === 'Kurs Front End Developer') {
            return '2000'
        } else if (nameCourse === 'Kurs Full Stack Developer') {
            return "5000"
        }
    }

    function valueVat() {
        if (typePerson === "Firma") {
            return "0.08"
        } else if (typePerson === "Osoba prywatna") {
            return "0.23"
        }
    }

    function valueVat2() {
        if (valueVat() === "0.08") {
            return "8%"
        } else if (valueVat() === "0.23") {
            return "23%"
        }
    }

    function sumPriceCourseAles() {
        let num1 = valuePriceCourse()
        let num2 = valueVat()
        num1 = parseFloat(num1)
        num2 = parseFloat(num2)
        let sum = num1 * num2
        sum = parseFloat(sum)
        let sumAll = (num1 + sum)
        return sumAll
    }

    function addClient(e, id) {
        e.preventDefault()
        const formData = {
            firstName,
            lastName,
            typePerson,
            nameCompany,
            numberIdCompany,
            numberId,
            address: {
                city,
                street,
                zipCode,
            }
        }

        axios.post('http://127.0.0.1:8080/client/add', formData)
            .then(() => {
                setError(
                    <p>Zgłoszenie zostało przyjęte pomyśłnie dnia </p>
                )
            })

        const formDataInvoice = {
            dataClient: [formData],
            vat,
            nameCourse,
            priceCourse,
            sumPriceCourse
        }

        axios.post('http://127.0.0.1:8080/invoice/add', formDataInvoice)
            .then(() => {
                setError(
                    <p>Zgłoszenie zostało przyjęte pomyśłnie</p>
                )
            })
        setFirstName('');
        setLastName('');
        setNameCompany('');
        setNumberId('');
        setStreet('');
        setTypePerson('');
        setNumberIdCompany('');
        setStreet('');
        setZipCode('');
        setCity('');
        setNameCourse('')
    };
    useEffect(() => {
        setSumPraiseCourse(sumPriceCourseAles());
        setVat(valueVat2());
        setPriceCourse(valuePriceCourse());
    })

    return (
        <div>
            {error}
            <form>
                <input
                    type='text'
                    placeholder="Wpisz imię"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    type='text'
                    placeholder="Wpisz Nazwisko"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <select
                    type='text'
                    name="typePerson"
                    value={typePerson}
                    onChange={(e) => setTypePerson(e.target.value)}
                >
                    <option>Rodzaj Faktury</option>
                    <option>Osoba prywatna</option>
                    <option>Firma</option>
                </select>
                {typePerson === "Osoba prywatna" && (
                    <input
                        type='text'
                        placeholder="Wpisz numer Pesel"
                        name="numberId"
                        value={numberId}
                        onChange={(e) => setNumberId(e.target.value)}
                    />
                )}

                {typePerson === "Firma" && (
                    <>
                        <input
                            type='text'
                            placeholder="Nazwa Firmy"
                            name="nameCompany"
                            value={nameCompany}
                            onChange={(e) => setNameCompany(e.target.value)}
                        />
                        <input
                            type='text'
                            placeholder="Wpisz numer NIP"
                            name="numberIdCompany"
                            value={numberIdCompany}
                            onChange={(e) => setNumberIdCompany(e.target.value)}
                        />
                    </>
                )}

                <label>
                    <span>Adres</span>
                    <input
                        type='text'
                        placeholder="Miasto"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder="Ulica"
                        name="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder="Kod Pocztowy"
                        name="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </label>

                {typePerson !== "" && typePerson !== "Rodzaj Faktury" && (
                    <label>
                        <span>Rodazj Kursu</span>
                        <select
                            type='text'
                            name="nameCourse"
                            value={nameCourse}
                            onChange={(e) => setNameCourse(e.target.value)}
                        >
                            <option>Wybierz</option>
                            <option>Kurs Front End Developer</option>
                            <option>Kurs Full Stack Developer</option>
                        </select>
                        {nameCourse === "Kurs Front End Developer" && (
                            <span>
                                <p>Cena Kursu : {sumPriceCourse} zł</p>
                            </span>
                        )}

                        {nameCourse === "Kurs Full Stack Developer" && (
                            <span>
                                <p>Cena Kursu : {sumPriceCourse} zł</p>
                            </span>
                        )}
                    </label>

                )}

                <button
                    type="submit"
                    onClick={addClient}>Generuj Fakture</button>
            </form>
        </div>
    )
}