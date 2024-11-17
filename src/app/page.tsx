'use client'

import Link from 'next/link'
import { getYears } from '../lib/years'
import { useEffect, useState } from 'react'

type TMake = {
  MakeId: number
  MakeName: string
}

export default function Home() {
  const [makes, setMakes] = useState<TMake[]>([])
  const [vehicle, setSelectedVehicle] = useState<number | null>(null)
  const [year, setSelectedYear] = useState<number | null>(null)
  const [link, setLink] = useState('')
  const availableYears = getYears(2015)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_MODELS}`)
      const data = await res.json()
      setMakes(data.Results)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (vehicle && year) {
      const newLink = `/result/${vehicle}/${year}`
      setLink(newLink)
    }
  }, [year, vehicle])

  const handleSearchVehicle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!vehicle || !year) {
      e.preventDefault()
    }
  }

  return (
    <section className="flex max-w-full flex-col gap-5 p-4">
      <h2 className="text-center text-4xl font-bold">
        Select a manufacturer and a year
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="vehicle" className="font-bold text-neutral-600">
          Vehicle
        </label>
        <select
          name="vehicle"
          id="vehicle"
          className="rounded-md border border-neutral-500 bg-white p-4 text-neutral-500"
          defaultValue={0}
          onChange={(e) =>
            setSelectedVehicle(e.currentTarget.value as unknown as number)
          }
        >
          <option value="0">Select a vehicle...</option>
          {makes.map(({ MakeId, MakeName }) => {
            return (
              <option key={MakeId} value={MakeId}>
                {MakeName}
              </option>
            )
          })}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="year" className="font-bold text-neutral-600">
          Year
        </label>
        <select
          name="year"
          id="year"
          className="rounded-md border border-neutral-500 bg-white p-4 text-neutral-500"
          defaultValue={0}
          onChange={(e) =>
            setSelectedYear(e.currentTarget.value as unknown as number)
          }
        >
          <option value="0">Select a year...</option>
          {availableYears.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>
      <Link
        className="mt-3"
        key={link}
        href={link}
        onClick={(e) => handleSearchVehicle(e)}
      >
        <button
          type="button"
          disabled={!year || !vehicle}
          className="w-full rounded-sm border border-purple-200 bg-purple-400 px-4 py-2.5 font-bold text-white transition-colors delay-75 duration-75 ease-linear disabled:border-neutral-200 disabled:bg-neutral-400 disabled:hover:cursor-not-allowed"
        >
          Next
        </button>
      </Link>
    </section>
  )
}
