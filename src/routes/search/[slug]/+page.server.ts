import { mediaEntityEnum } from './../../../lib/types';
import { data as stData } from '../../stData';
import { API_KEY } from '$env/static/private';
import searchResultCookie from '$lib/helpers/searchResultCookie';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, error, fetch, cookies, url }) => {
	if (!params.slug) {
		throw error(404, {
			message: 'Invalid',
		});
	}
	// check if we don't already have results in our store, the cookie is just a bool flag
	const browserHasDataAlready = cookies.get(searchResultCookie.cookieName);
	if (browserHasDataAlready) {
		// said cookie is deleted here so on refresh of the current page, we get newer data
		cookies.delete(searchResultCookie.cookieName);
	}

	if (url.searchParams.has(mediaEntityEnum.person)) {
		let foundPersonData = {};
		// make a fresh call to the relevant api via the url (user landed on this page through a share or direct ingress)
		if (!browserHasDataAlready) {
			const personRes = await fetch(
				`https://api.themoviedb.org/3/person/${params.slug}?api_key=${API_KEY}`,
			);
			foundPersonData = await personRes.json();
		}
		// const personRes = await fetch("/person")
		// when you search for a person, no need to fetch anything from api
		// modify the data to create a custom 'headline'

		return { type: mediaEntityEnum.person, ...foundPersonData, ...stData[params.slug] };
	}

	// const multiSearchRes = await fetch("/multisearch")

	// const multiSearchRes = await fetch(`/api/multisearch?query=${encodeURI(params.slug)}`);

	// 		`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${url.searchParams.get(
	// // const multiSearchRes = await fetch(
	// // 	`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURI(params.slug)}`,
	// // );
	// const multiSearchData = await multiSearchRes.json();
	// return multiSearchData;
	// return {
	// 	// matching first entry as results are sorted by popularity and fuzzy match, usually first one is good
	// 	intersection: stData[2057224],
	// };
};
