import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RegulatoryBody } from '../backend';
import { useTranslation } from '../i18n/i18n';

interface RegulatoryBodyCardProps {
  body: RegulatoryBody;
}

export default function RegulatoryBodyCard({ body }: RegulatoryBodyCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-start justify-between gap-2">
          <span>{body.name}</span>
          {body.state && (
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {body.state}
            </span>
          )}
        </CardTitle>
        <CardDescription>{body.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Address */}
        {body.address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('regulatoryBodies.fields.address')}</p>
              <p className="text-sm text-foreground">{body.address}</p>
            </div>
          </div>
        )}

        {/* Email */}
        {body.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('regulatoryBodies.fields.email')}</p>
              <a
                href={`mailto:${body.email}`}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline break-all"
              >
                {body.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {body.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('regulatoryBodies.fields.phone')}</p>
              <a
                href={`tel:${body.phone}`}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                {body.phone}
              </a>
            </div>
          </div>
        )}

        {/* Website */}
        {body.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('regulatoryBodies.fields.website')}</p>
              <a
                href={body.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline break-all"
              >
                {body.website}
              </a>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {body.email && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="text-xs"
            >
              <a href={`mailto:${body.email}`}>
                <Mail className="h-3 w-3 mr-1" />
                {t('regulatoryBodies.actions.sendEmail')}
              </a>
            </Button>
          )}
          {body.website && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="text-xs"
            >
              <a href={body.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3 w-3 mr-1" />
                {t('regulatoryBodies.actions.visitWebsite')}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
