import { Metadata } from 'next';
import { getEventById } from '@/mocks/data/events';
import EventDetailsPage from '@/components/EventDetailsPage';

type Params = Promise<{ id: string }>;

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) {
        return { title: 'Event Not Found' };
    }

    return {
        title: event.title,
        description: event.description.substring(0, 160),
        openGraph: {
            title: event.title,
            description: event.description.substring(0, 160),
            images: [event.image],
        },
    };
}

export default async function EventPage({
    params,
}: {
    params: Params;
}) {
    const { id } = await params;

    return <EventDetailsPage id={id} />;
}
