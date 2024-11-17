import { getYears } from '@/lib/years'
import Link from 'next/link'
import { Suspense } from 'react'

type TProps = Promise<{ makeId: string; year: string }>
type TModel = {
  Model_ID: number
  Model_Name: string
  Make_Name: string
}

export async function generateStaticParams() {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL_MODELS}`)
  const data = await request.json()
  const models = data.Results
  const years = getYears(2015)

  return models.flatMap((model: { MakeId: number }) => {
    return years.map((year) => ({
      makeId: model.MakeId.toString(),
      year: year.toString(),
    }))
  })
}

async function getModels(makeId: string, year: string) {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error!, status: ${response.status}`)
    }

    const data = await response.json()
    if (!data || !data.Results) {
      throw new Error('Invalid response')
    }

    return data
  } catch (error) {
    console.error('Error fetching models: ', error)
    return { Results: [] }
  }
}

export default async function ResultPage(props: { params: TProps }) {
  const { makeId, year } = await props.params
  const data = await getModels(makeId, year)

  const uniqueModels = new Set()
  const models: TModel[] = data.Results
  const newModels = models.filter((model) => {
    const duplicate = uniqueModels.has(model.Model_ID)
    uniqueModels.add(model.Model_ID)
    return !duplicate
  })

  return (
    <section className="w-full max-w-full p-4">
      <h2 className="mt-16 text-3xl font-bold sm:mt-0">
        Vehicle models for year <span className="text-purple-500">{year}</span>
      </h2>
      <Suspense
        fallback={
          <p className="text-center text-lg font-semibold text-neutral-500">
            Loading models...
          </p>
        }
      >
        <section className="flex w-full flex-col gap-3">
          <p className="text-lg font-semibold">
            {data.Count > 0
              ? `Results found (${data.Count}):`
              : 'No results founded'}
          </p>
          {newModels.at(0) != null && (
            <h5 className="text-lg">
              Made by,{' '}
              <span className="font-semibold text-purple-500">
                {newModels.at(0)?.Make_Name ?? ''}
              </span>
            </h5>
          )}
          <ul className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-2.5 sm:grid-cols-2">
            {newModels.length > 0 ? (
              newModels.map(({ Model_ID, Model_Name }) => {
                return (
                  <li
                    key={Model_ID}
                    className="w-full rounded-md border border-neutral-300 p-4 transition ease-in-out hover:cursor-default hover:bg-neutral-200 hover:text-purple-500"
                  >
                    <small>#{Model_ID}</small>
                    <h6 className="text-xl font-bold">{Model_Name}</h6>
                  </li>
                )
              })
            ) : (
              <p className="col-span-full">
                No models were found for this make and year
              </p>
            )}
          </ul>
          <Link className="mt-3" href="/">
            <button
              type="button"
              className="w-full rounded-sm border border-purple-200 bg-purple-400 px-4 py-2.5 font-bold text-white transition-colors delay-75 duration-75 ease-linear"
            >
              Search more
            </button>
          </Link>
        </section>
      </Suspense>
    </section>
  )
}
