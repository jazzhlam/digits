import { getServerSession } from 'next-auth';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import StuffItem from '@/components/StuffItem';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import ContactCard from '@/components/ContactCard';
import { Contact } from '@/lib/validationSchemas';
import { redirect } from 'next/navigation';

/** Render a list of stuff (from Prisma) and sample contacts (for Digits 2 view). */
const ListPage = async () => {
  // Protect the page, only logged-in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  // --- Prisma Stuff ---
  const owner = (session && session.user && session.user.email) || '';
  const stuff = await prisma.stuff.findMany({
    where: { owner },
  });

  // --- Static Contacts (for Digits 2 visual section) ---
  const contacts: Contact[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Aloha St, Honolulu, HI',
      image: 'https://placehold.co/200x200',
      description: 'Enjoys surfing and coding.',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Kapiolani Blvd, Honolulu, HI',
      image: 'https://placehold.co/200x200',
      description: 'Loves hiking and photography.',
    },
    {
      firstName: 'Kai',
      lastName: 'Lee',
      address: '789 University Ave, Honolulu, HI',
      image: 'https://placehold.co/200x200',
      description: 'ICS 314 student interested in web development.',
    },
  ];

  return (
    <main>
      <Container id="list" fluid className="py-3">
        {/* ---------- STUFF SECTION ---------- */}
        <Row>
          <Col>
            <h1>Stuff</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => (
                  <StuffItem key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* ---------- CONTACTS SECTION ---------- */}
        <Row className="mt-5">
          <Col>
            <h1 className="text-center mb-4">Contacts</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
              {contacts.map((contact) => {
                const key = `${contact.firstName}-${contact.lastName}-${contact.address}`;
                return (
                  <Col key={key}>
                    <ContactCard contact={contact} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default function Home() {
  // Redirect root URL to the list page so the template doesn't show
  redirect('/list');
}
