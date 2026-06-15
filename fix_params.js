const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the params type definition
    content = content.replace(
        /\{ params \}: \{ params: \{ ([^}]+) \} \}/g,
        '{ params }: { params: Promise<{  }> }'
    );

    // Add the await params statement right after the function block starts
    // We look for 'export async function (GET|POST|PATCH|DELETE)(\s*\(.*\)\s*\{)'
    content = content.replace(
        /(export async function [A-Z]+\(.*?\)\s*\{)(?!\s*const \{)/g,
        (match, p1) => {
            // Find what parameters were extracted in the signature
            // Wait, we can just extract the properties by looking at the content
            // The easier way is to just do const resolvedParams = await params;
            return p1 + '\n  const resolvedParams = await params;';
        }
    );

    // Replace params.eventId, params.passcode etc with resolvedParams
    content = content.replace(/params\.([a-zA-Z0-9_]+)/g, 'resolvedParams.');

    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
}

const files = [
    'src/app/api/events/by-passcode/[passcode]/route.ts',
    'src/app/api/events/by-passcode/[passcode]/photos/route.ts',
    'src/app/api/events/[eventId]/route.ts',
    'src/app/api/events/[eventId]/photos/route.ts',
    'src/app/api/events/[eventId]/photos/[photoId]/route.ts',
    'src/app/api/events/[eventId]/status/route.ts',
    'src/app/api/events/[eventId]/upload/route.ts'
];

files.forEach(processFile);
