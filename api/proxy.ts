export const runtime = 'edge';

const API_BASE = 'http://160.22.107.121:8081';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const apiUrl = `${API_BASE}${path}${url.search}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
    },
  });

  const data = await response.json();
  return Response.json(data, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const apiUrl = `${API_BASE}${path}`;

  const body = await request.text();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
    },
    body,
  });

  const data = await response.json();
  return Response.json(data, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const apiUrl = `${API_BASE}${path}`;

  const body = await request.text();

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
    },
    body,
  });

  const data = await response.json();
  return Response.json(data, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');
  const apiUrl = `${API_BASE}${path}`;

  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
    },
  });

  const data = await response.json();
  return Response.json(data, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
