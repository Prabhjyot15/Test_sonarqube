/*
 * SonarQube
 * Copyright (C) 2009-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { ContentCell, NumericalCell, RatingCell } from 'design-system';
import * as React from 'react';
import { translate } from '../../../helpers/l10n';
import { isPortfolioLike } from '../../../types/component';
import { MetricKey } from '../../../types/metrics';
import { ComponentMeasure } from '../../../types/types';

interface ComponentsHeaderProps {
  baseComponent?: ComponentMeasure;
  canBePinned?: boolean;
  metrics: string[];
  rootComponent: ComponentMeasure;
  showAnalysisDate?: boolean;
}

const SHORT_NAME_METRICS = [
  MetricKey.duplicated_lines_density,
  MetricKey.new_lines,
  MetricKey.new_coverage,
  MetricKey.new_duplicated_lines_density,
];

export default function ComponentsHeader(props: ComponentsHeaderProps) {
  const { baseComponent, canBePinned = true, metrics, rootComponent, showAnalysisDate } = props;
  const isPortfolio = isPortfolioLike(rootComponent.qualifier);
  let columns: string[] = [];
  let Cell: typeof NumericalCell;
  if (isPortfolio) {
    columns = [
      translate('metric_domain.Releasability'),
      translate('metric_domain.Reliability'),
      translate('portfolio.metric_domain.vulnerabilities'),
      translate('portfolio.metric_domain.security_hotspots'),
      translate('metric_domain.Maintainability'),
      translate('metric.ncloc.name'),
    ];

    if (showAnalysisDate) {
      columns.push(translate('code.last_analysis_date'));
    }

    Cell = RatingCell;
  } else {
    columns = metrics.map((metric) =>
      translate(
        'metric',
        metric,
        SHORT_NAME_METRICS.includes(metric as MetricKey) ? 'short_name' : 'name',
      ),
    );

    Cell = NumericalCell;
  }

  return (
    <>
      {canBePinned && <ContentCell aria-label={translate('code.pin')} />}
      <ContentCell aria-label={translate('code.name')} />
      {baseComponent &&
        columns.map((column) => (
          <Cell className="sw-whitespace-nowrap" key={column}>
            {column}
          </Cell>
        ))}
    </>
  );
}
